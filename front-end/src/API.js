// api.js

export async function sendLoginRequest(data) {
  //data {username: 'nhan', password: 'nhan', remember-me: 'on'}
  try {
    const response = await fetch("http://localhost:3000/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function sendSignupRequest(data) {
  // data {username: 'nhan', name: 'Nguyễn Nhân', dob: '2024-07-17', email: 'nhannguyentrong355@gmail.com', password: 'nhan'}
  try {
    const response = await fetch("http://localhost:3000/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function forgotPassword(data) {
  // data {email }
  try {
    const response = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function renderMainPage() {
  try {
    const response = await fetch("http://localhost:3000/rendermp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function renderProfile(data) {
  //data {idaccount: idaccount}
  try {
    const response = await fetch("http://localhost:3000/render_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function updateProfile(data) {
  try {
    const response = await fetch("http://localhost:3000/update_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Make sure this header is set
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function renderEvent(data) {
  // data {username: eventname}
  try {
    const response = await fetch("http://localhost:3000/renderevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function renderEventPost(data) {
  try {
    const response = await fetch("http://localhost:3000/renderpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function uploadPost(data) {
  try {
    const response = await fetch("http://localhost:3000/submit-post", {
      method: "POST",
      body: data, // Không cần headers vì fetch sẽ tự động thêm headers phù hợp cho FormData
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function getPostInteraction(data) {
  try {
    const response = await fetch("http://localhost:3000/get-interaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function commentPost(data) {
  try {
    const response = await fetch("http://localhost:3000/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function likePost(data) {
  try {
    const response = await fetch("http://localhost:3000/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function createEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/create_event", {
      method: "POST",
      body: data,
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function searchEvent() {
  try {
    const response = await fetch("http://localhost:3000/searchevent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function ChangeAvatar(data) {
  try {
    const response = await fetch("http://localhost:3000/change_avatar", {
      method: "POST",
      body: data,
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function followEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function OrderTicket(data) {
  try {
    const response = await fetch("http://localhost:3000/order_ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function CancelTicket(data) {
  try {
    const response = await fetch("http://localhost:3000/cancel_ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function StatusOrder(data) {
  try {
    const response = await fetch("http://localhost:3000/status_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function JoinEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function RenderEventMP(data) {
  try {
    const response = await fetch("http://localhost:3000/render_event_mp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function AdminRenderEvent() {
  try {
    const response = await fetch("http://localhost:3000/admin_renderevent", {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function AdminApproveEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/admin_approveevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function RenderDataEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/renderdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function AdminListComment() {
  try {
    const response = await fetch("http://localhost:3000/admin-list-comment", {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function GetNotification(data) {
  try {
    const response = await fetch("http://localhost:3000/get_notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function Followers(data) {
  try {
    const response = await fetch("http://localhost:3000/followers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function CancelEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/cancelevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function EditEvent(data) {
  try {
    const response = await fetch("http://localhost:3000/editevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function ChangePassword(data) {
  try {
    const response = await fetch("http://localhost:3000/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred" };
  }
}