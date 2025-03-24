export async function getAllDogs() {
  const response = await fetch("https://localhost:7202/Dog");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function getDogById(id: number) {
  const response = await fetch(`https://localhost:7202/Dog/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function createDog(formData: FormData) {
  const response = await fetch("https://localhost:7202/Dog", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Network response was not ok: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

export function getImageUrl(dogId: number | null | undefined) {
  if (!dogId) return "https://via.placeholder.com/400x300";
  return `https://localhost:7202/Dog/image/${dogId}`;
}

export async function deleteDog(id: number) {
  try {
    const response = await fetch(`https://localhost:7202/Dog/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to delete: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Delete operation failed:", error);
    throw error;
  }
}

export interface CreateDogDTO {
  dogID: number;
  name: string;
  age: number;
  race: string;
  weight: number;
  ownerID: number;
}

export interface Dog extends CreateDogDTO {
  dogID: number;
  description?: string;
  imagePath?: string;
}
