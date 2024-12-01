export async function getAllDogs() {
    const response = await fetch('https://localhost:7202/Dog'); // Replace with your API URL
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

export interface Dog {
    name: string;
    age: number;
    breed: string;
    owner: string;
  }
