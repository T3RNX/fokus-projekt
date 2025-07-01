export async function getAllOwners() {
  const response = await fetch("https://localhost:7202/Owner");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function getOwnerById(id: number) {
  const response = await fetch(`https://localhost:7202/Owner/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function createOwner(owner: CreateOwnerDTO) {
  const response = await fetch("https://localhost:7202/Owner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(owner),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Create failed: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

export async function updateOwner(updatedOwner: CreateOwnerDTO) {
  const response = await fetch(
    `https://localhost:7202/Owner/${updatedOwner.ownerID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOwner),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}

export async function deleteOwner(id: number) {
  try {
    const response = await fetch(`https://localhost:7202/Owner/${id}`, {
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

export function getOwnerImageUrl(ownerId: number | null | undefined) {
  if (!ownerId) return "https://via.placeholder.com/150x150";
  return `https://localhost:7202/Owner/image/${ownerId}`;
}

export interface CreateOwnerDTO {
  ownerID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
