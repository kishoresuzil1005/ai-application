import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dresses() {
  const [dresses, setDresses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/dresses')
      .then(response => {
        setDresses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dresses</h1>
      <ul>
        {dresses.map(dress => (
          <li key={dress.id}>
            <Link href={`/dresses/${dress.id}`}>{dress.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}