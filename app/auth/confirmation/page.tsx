// page.tsx
'use client';

import { Suspense } from 'react';
import ApprovePageInner from './ApprovePageInner';

export default function ApprovePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApprovePageInner />
    </Suspense>
  );
}
