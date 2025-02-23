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


  export async function deleteDog(id: number) {
    try {
      const response = await fetch(`https://localhost:7202/Dog/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete: ${errorData}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw error;
    }
  }

export interface Dog {
    id: number;
    name: string;
    age: number;
    race: string;
    weight: number;
    ownerID: number;

}

