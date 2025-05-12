interface Treatment {
  treatmentID: number;
  dogID: number;
  description: string;
  date: string;
  time: string;
  cost: number;
  dogName?: string;
}

export async function getAllTreatments() {
  const response = await fetch("https://localhost:7202/Treatment");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function getTreatmentById(id: number) {
  const response = await fetch(`https://localhost:7202/Treatment/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function createTreatment(
  treatment: Omit<Treatment, "treatmentID">
): Promise<Treatment> {
  const response = await fetch("https://localhost:7202/Treatment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(treatment),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Network response was not ok: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

export async function updateTreatment(treatment: Treatment) {
  const response = await fetch(
    `https://localhost:7202/Treatment/${treatment.treatmentID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treatment),
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function patchTreatment(
  treatmentID: number,
  cost: number,
  description: string
) {
  const response = await fetch(
    `https://localhost:7202/Treatment/${treatmentID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cost, description }),
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function deleteTreatment(id: number) {
  const response = await fetch(`https://localhost:7202/Treatment/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}
