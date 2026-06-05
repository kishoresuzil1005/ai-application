import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function DressDetails() {
  const [dress, setDress] = useState({});
  const router = useRouter();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/dresses/${router.query.id}`)
      .then(response => {
        setDress(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [router.query.id]);

  return (
    <div>
      <h1 className="text-3xl font-bold">{dress.name}</h1>
      <p>{dress.description}</p>
      <p>Price: {dress.price}</p>
    </div>
  );
}