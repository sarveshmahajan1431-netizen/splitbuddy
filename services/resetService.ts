export const clearAllData = async () => {
  localStorage.clear();
  try {
    await fetch('/api/seed', { method: 'POST' });
  } catch (e) {
    console.error('Failed to trigger database re-seed API:', e);
  }
  window.location.reload();
};