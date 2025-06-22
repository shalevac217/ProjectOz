document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  console.log(`/api/list/${userId}`);
  
  fetch(`/api/list/${userId}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch groceries");
      return res.json();
    })
    .then(groceries => renderGroceries(groceries))
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("groceriesList").innerHTML =
        "<p>לא ניתן לטעון את רשימת המצרכים</p>";
    });
});
function renderGroceries(groceries) {
  const container = document.getElementById("groceriesList");
  container.innerHTML = "";

  if (groceries.length === 0) {
    container.innerHTML = "<p>הרשימה ריקה</p>";
    return;
  }

  groceries.forEach(({ id, text }) => {
    const item = document.createElement("div");
    item.className = "grocery-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = text;
    item.appendChild(nameSpan);

    const editBtn = document.createElement("button");
    editBtn.textContent = "ערוך";
    editBtn.addEventListener("click", () => editGrocery(id));
    item.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "מחק";
    deleteBtn.addEventListener("click", () => deleteGrocery(id));
    item.appendChild(deleteBtn);

    container.appendChild(item);
  });
}
function addGrocery() {
  const userId = localStorage.getItem("userId");
  const groceryName = document.getElementById("groceryName").value;

  if (!groceryName) {
    alert("נא להזין שם מצרך");
    return;
  }

  fetch("/api/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, text: groceryName })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add grocery");
      return res.json();
    })
    .then(() => {
      document.getElementById("groceryName").value = "";
      location.reload();
    })
    .catch(err => console.error("Error:", err));
}

function deleteGrocery(groceryId) {
  fetch(`/api/list/${groceryId}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete grocery");
      return res.json();
    })
    .then(() => {
      location.reload();
    })
    .catch(err => console.error("Error:", err));
}

function editGrocery(groceryId) {
  const newName = prompt("נא להזין שם חדש למצרך:");
  if (!newName) return;

  fetch(`/api/list/${groceryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: newName })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to edit grocery");
      return res.json();
    })
    .then(() => {
      location.reload();
    })
    .catch(err => console.error("Error:", err));
}

document.getElementById("addGroceryBtn").addEventListener("click", addGrocery);
