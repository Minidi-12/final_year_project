export const putImage = async ({ file }) => {
  try {
    const res = await fetch(`https://final-year-project-backend-su8k.onrender.com/api/b_reqs/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileType: file.type }),
    });

    const data = await res.json();
    const { url, publicURL } = data;

    if (!url) {
      throw new Error("Failed to get presigned URL from server");
    }

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`R2 upload failed with status ${uploadRes.status}`);
    }

    console.log("File uploaded successfully to R2:", publicURL);

    return publicURL;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};
