import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Upload,
  X,
  ImagePlus,
  Loader2,
  ArrowLeft,
  Building2,
  IndianRupee,
  MapPin,
  FileText,
} from "lucide-react";

const AddProperty = () => {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  // ======================================================
  // ================= USER ===============================
  // ======================================================

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // ======================================================
  // ================= ROLE CHECK =========================
  // ======================================================

  useEffect(() => {

    if (
      !user ||
      ![
        "seller",
        "builder",
        "admin",
        "agent",
      ].includes(
        user.role
      )
    ) {

      navigate("/login");
    }

  }, [user, navigate]);

  // ======================================================
  // ================= FORM ===============================
  // ======================================================

  const [formData, setFormData] =
    useState({
      title: "",
      price: "",
      location: "",
      type: "",
      subType: "",
      constructionStatus:
        "",
      description: "",
    });

  // ======================================================
  // ================= IMAGES =============================
  // ======================================================

  const [images, setImages] =
    useState([]);

  const [previews, setPreviews] =
    useState([]);

  // ======================================================
  // ================= HANDLE CHANGE ======================
  // ======================================================

  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================================================
  // ================= IMAGE CHANGE =======================
  // ======================================================

  const handleImageChange =
    (e) => {

      const files =
        Array.from(
          e.target.files
        );

      if (
        images.length +
          files.length >
        15
      ) {

        alert(
          "Maximum 15 images allowed"
        );

        return;
      }

      // ================= STORE FILES =================
      setImages(
        (prev) => [
          ...prev,
          ...files,
        ]
      );

      // ================= PREVIEW =====================
      const newPreviews =
        files.map((file) =>
          URL.createObjectURL(
            file
          )
        );

      setPreviews(
        (prev) => [
          ...prev,
          ...newPreviews,
        ]
      );
    };

  // ======================================================
  // ================= REMOVE IMAGE =======================
  // ======================================================

  const removeImage = (
    index
  ) => {

    const updatedImages =
      [...images];

    const updatedPreviews =
      [...previews];

    updatedImages.splice(
      index,
      1
    );

    updatedPreviews.splice(
      index,
      1
    );

    setImages(
      updatedImages
    );

    setPreviews(
      updatedPreviews
    );
  };

  // ======================================================
  // ================= SUBMIT =============================
  // ======================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        alert(
          "Please login first"
        );

        navigate(
          "/login"
        );

        return;
      }

      if (
        images.length ===
        0
      ) {

        alert(
          "Please upload at least one image"
        );

        return;
      }

      try {

        setLoading(true);

        // ======================================================
        // ================= FORMDATA ===========================
        // ======================================================

        const data =
          new FormData();

        // ================= TEXT FIELDS =================
        Object.keys(
          formData
        ).forEach(
          (key) => {

            data.append(
              key,
              formData[
                key
              ]
            );
          }
        );

        // ================= MULTI IMAGES =================
        images.forEach(
          (image) => {

            data.append(
              "images",
              image
            );
          }
        );

        // ======================================================
        // ================= API ================================
        // ======================================================

        const res =
          await fetch(
            "http://localhost:5000/api/properties/add",
            {
              method:
                "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: data,
            }
          );

        const result =
          await res.json();

        // ======================================================
        // ================= SUCCESS ============================
        // ======================================================

        if (res.ok) {

          if (
            user?.role ===
            "admin"
          ) {

            alert(
              "Property published instantly 🚀"
            );

          } else {

            alert(
              "Property submitted successfully ✅"
            );
          }

          // ================= RESET =================
          setFormData({
            title: "",
            price: "",
            location: "",
            type: "",
            subType: "",
            constructionStatus:
              "",
            description:
              "",
          });

          setImages([]);

          setPreviews([]);

          // ================= REDIRECT =================
          if (
            user?.role ===
            "admin"
          ) {

            navigate(
              "/admin/properties/approved"
            );

          } else {

            navigate(
              "/my-properties"
            );
          }

        } else {

          alert(
            result.message ||
              "Failed to add property"
          );
        }

      } catch (error) {

        console.log(
          error
        );

        alert(
          "Server error"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-6xl mx-auto bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-200">

        {/* ====================================================== */}
        {/* ================= HEADER ============================= */}
        {/* ====================================================== */}

        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl transition mb-6"
          >

            <ArrowLeft size={18} />

            Back

          </button>

          <h1 className="text-4xl font-bold">

            Add New Property

          </h1>

          <p className="text-blue-100 mt-3 text-lg">

            Create premium property listings with image galleries

          </p>

        </div>

        {/* ====================================================== */}
        {/* ================= FORM =============================== */}
        {/* ====================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="p-8 md:p-10"
        >

          <div className="grid md:grid-cols-2 gap-6">

            {/* TITLE */}
            <div>

              <label className="font-semibold flex items-center gap-2 mb-2">

                <Building2 size={18} />

                Property Title

              </label>

              <input
                type="text"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                placeholder="Luxury 3BHK Apartment"
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PRICE */}
            <div>

              <label className="font-semibold flex items-center gap-2 mb-2">

                <IndianRupee size={18} />

                Price

              </label>

              <input
                type="number"
                name="price"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                placeholder="5000000"
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* LOCATION */}
            <div>

              <label className="font-semibold flex items-center gap-2 mb-2">

                <MapPin size={18} />

                Location

              </label>

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="Mumbai"
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* TYPE */}
            <div>

              <label className="font-semibold mb-2 block">

                Property Type

              </label>

              <select
                name="type"
                value={
                  formData.type
                }
                onChange={
                  handleChange
                }
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  Select Type
                </option>

                <option value="Residential">
                  Residential
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Agriculture">
                  Agriculture
                </option>

              </select>

            </div>

            {/* SUBTYPE */}
            <div>

              <label className="font-semibold mb-2 block">

                Sub Type

              </label>

              <input
                type="text"
                name="subType"
                value={
                  formData.subType
                }
                onChange={
                  handleChange
                }
                placeholder="3BHK / Office / Villa"
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* CONSTRUCTION */}
            <div>

              <label className="font-semibold mb-2 block">

                Construction Status

              </label>

              <select
                name="constructionStatus"
                value={
                  formData.constructionStatus
                }
                onChange={
                  handleChange
                }
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  Select Status
                </option>

                <option value="Ready to Move">
                  Ready to Move
                </option>

                <option value="Under Construction">
                  Under Construction
                </option>

                <option value="New Launch">
                  New Launch
                </option>

              </select>

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= DESCRIPTION ======================== */}
          {/* ====================================================== */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2 mb-2">

              <FileText size={18} />

              Description

            </label>

            <textarea
              name="description"
              rows="5"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Describe your property..."
              required
              className="w-full border border-slate-300 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

          {/* ====================================================== */}
          {/* ================= MULTI IMAGE ======================== */}
          {/* ====================================================== */}

          <div className="mt-10">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-2xl font-bold">

                  Property Gallery

                </h2>

                <p className="text-slate-500 mt-1">

                  Upload up to 15 high quality images

                </p>

              </div>

              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold">

                {images.length}/15 Images

              </div>

            </div>

            {/* UPLOAD BOX */}
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 transition rounded-[28px] p-10 flex flex-col items-center justify-center cursor-pointer bg-slate-50">

              <div className="bg-blue-100 p-5 rounded-full mb-5">

                <ImagePlus className="text-blue-700" size={38} />

              </div>

              <h3 className="text-xl font-bold">

                Upload Property Images

              </h3>

              <p className="text-slate-500 mt-2 text-center">

                JPG, PNG, WEBP supported

              </p>

              <div className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2">

                <Upload size={18} />

                Select Images

              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </label>

            {/* ====================================================== */}
            {/* ================= PREVIEWS =========================== */}
            {/* ====================================================== */}

            {previews.length >
              0 && (

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">

                {previews.map(
                  (
                    preview,
                    index
                  ) => (

                    <div
                      key={
                        index
                      }
                      className="relative group rounded-3xl overflow-hidden shadow-lg border border-slate-200"
                    >

                      {/* PRIMARY */}
                      {index ===
                        0 && (

                        <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">

                          Primary

                        </div>
                      )}

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition"
                      >

                        <X size={16} />

                      </button>

                      {/* IMAGE */}
                      <img
                        src={
                          preview
                        }
                        alt="preview"
                        className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                      />

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ====================================================== */}
          {/* ================= SUBMIT ============================= */}
          {/* ====================================================== */}

          <button
            type="submit"
            disabled={
              loading
            }
            className={`w-full mt-10 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Uploading Property...
              </>
            ) : (
              <>
                <Upload size={22} />
                Submit Property
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default AddProperty;