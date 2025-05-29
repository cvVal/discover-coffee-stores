import React from 'react'
import Link from 'next/link';

export default function Page(props : { params: { id: string } }) {
    const {
    params: { id },
    } = props;
  console.log('Coffee Store ID:', id);
  return (
    <div>
        Dynamic Coffee Store Page: {id}
        <Link href="/">
            ← Back to Home
        </Link>
    </div>
  )
}
