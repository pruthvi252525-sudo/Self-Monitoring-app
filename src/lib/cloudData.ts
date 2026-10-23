import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type { DailyMetric, Task, TimeBlock, WorkspaceAsset } from '../types';
import { db, storage } from './firebase';

export interface AppDataSnapshot {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  dailyMetrics: DailyMetric[];
}

const LEGACY_STORAGE_KEY = 'self_monitoring_app_storage_v1';

function userDataDocument(uid: string) {
  if (!db) throw new Error('Firebase Firestore is not configured.');
  return doc(db, 'users', uid);
}

export function readLegacyAppData(): AppDataSnapshot | null {
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return null;

  let parsed: { state?: Partial<AppDataSnapshot> };
  try {
    parsed = JSON.parse(raw) as { state?: Partial<AppDataSnapshot> };
  } catch (error) {
    throw new Error(
      `The existing browser data could not be read, so it was not imported. ${
        error instanceof Error ? error.message : ''
      }`
    );
  }

  const state = parsed.state;
  if (
    !state ||
    !Array.isArray(state.tasks) ||
    !Array.isArray(state.timeBlocks) ||
    !Array.isArray(state.dailyMetrics)
  ) {
    throw new Error('The existing browser data has an unexpected format and was not imported.');
  }

  return {
    tasks: state.tasks,
    timeBlocks: state.timeBlocks,
    dailyMetrics: state.dailyMetrics,
  };
}

async function moveInlineAssetsToStorage(
  uid: string,
  tasks: Task[]
): Promise<Task[]> {
  return Promise.all(
    tasks.map(async (task) => ({
      ...task,
      assets: await Promise.all(
        (task.assets ?? []).map(async (asset: WorkspaceAsset) => {
          if (!asset.url.startsWith('data:')) return asset;
          if (!storage) {
            throw new Error('Firebase Storage is not configured, so attached files cannot be imported.');
          }

          const response = await fetch(asset.url);
          if (!response.ok) throw new Error(`Could not read the attached file "${asset.name}".`);
          const file = await response.blob();
          const safeName = asset.name.replace(/[^\w.-]/g, '_');
          const assetRef = ref(storage, `users/${uid}/assets/${asset.id}/${safeName}`);
          await uploadBytes(assetRef, file, { contentType: file.type || 'application/octet-stream' });

          return { ...asset, url: await getDownloadURL(assetRef) };
        })
      ),
    }))
  );
}

export async function prepareAppDataForCloud(
  uid: string,
  data: AppDataSnapshot
): Promise<AppDataSnapshot> {
  return {
    ...data,
    tasks: await moveInlineAssetsToStorage(uid, data.tasks),
  };
}

export async function loadUserAppData(uid: string): Promise<AppDataSnapshot | null> {
  const snapshot = await getDoc(userDataDocument(uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  if (
    !Array.isArray(data.tasks) ||
    !Array.isArray(data.timeBlocks) ||
    !Array.isArray(data.dailyMetrics)
  ) {
    throw new Error('The saved Firebase data has an unexpected format.');
  }

  return {
    tasks: data.tasks as Task[],
    timeBlocks: data.timeBlocks as TimeBlock[],
    dailyMetrics: data.dailyMetrics as DailyMetric[],
  };
}

export async function saveUserAppData(
  uid: string,
  data: AppDataSnapshot
): Promise<void> {
  await setDoc(userDataDocument(uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function clearLegacyAppData(): void {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
