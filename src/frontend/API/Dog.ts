export async function getAllDogs() {
    const response = await fetch('https://localhost:7202/Dog');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

export async function createDog(dog: Dog) {
    const response = await fetch('https://localhost:7202/Dog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dog),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  }

export interface Dog {
    name: string;
    age: number;
    race: string;
    weight: number;
    ownerID: number;

}

