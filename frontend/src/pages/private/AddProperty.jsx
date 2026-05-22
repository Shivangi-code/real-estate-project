import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProperty() {

  const navigate =
    useNavigate();

  // ================= FORM DATA =================

  const [formData,
    setFormData] =
    useState({

      title: "",

      // PRICE
      price: "",
      priceUnit: "lac",

      // AREA
      area: "",
      areaUnit: "sqft",

      location: "",

      type: "",

      constructionStatus: "",

      description: "",
    });

  // ================= IMAGES =================

  const [images,
    setImages] =
    useState([]);

  // ================= LOADING =================

  const [loading,
    setLoading] =
    useState(false);

  // ================= HANDLE CHANGE =================

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  // ================= HANDLE IMAGES =================

  const handleImage =
    (e) => {

      setImages(
        Array.from(
          e.target.files
        )
      );
    };

  // ================= SUBMIT =================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          new FormData();

        // ================= APPEND FORM DATA =================

        Object.keys(
          formData
        ).forEach((key) => {

          data.append(
            key,
            formData[key]
          );
        });

        // ================= MULTIPLE IMAGES =================

        images.forEach((img) => {

          data.append(
            "images",
            img
          );
        });

        // ================= API =================

        const res =
          await axios.post(

            "http://localhost:5000/api/properties/add",

            data,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          res.data.success
        ) {

          alert(
            "Property Added Successfully 🚀"
          );

          navigate(
            "/properties"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          error?.response?.data
            ?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-[#071133] mb-8">

          Add New Property

        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* ================= TITLE ================= */}

          <div>

            <label className="block mb-2 font-semibold">

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
              className="w-full border rounded-2xl px-4 py-3"
              required
            />

          </div>

          {/* ================= PRICE ================= */}

          <div className="grid grid-cols-2 gap-4">

            {/* PRICE */}

            <div>

              <label className="block mb-2 font-semibold">

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
                placeholder="Enter property price"
                className="w-full border rounded-2xl px-4 py-3"
                required
              />

            </div>

            {/* PRICE UNIT */}

            <div>

              <label className="block mb-2 font-semibold">

                Price Unit

              </label>

              <select
                name="priceUnit"
                value={
                  formData.priceUnit
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-2xl px-4 py-3 bg-white"
              >

                <option value="lac">
                  Lac
                </option>

                <option value="cr">
                  Cr
                </option>

              </select>

            </div>

          </div>

          {/* ================= AREA ================= */}

          <div className="grid grid-cols-2 gap-4">

            {/* AREA */}

            <div>

              <label className="block mb-2 font-semibold">

                Area

              </label>

              <input
                type="number"
                name="area"
                value={
                  formData.area
                }
                onChange={
                  handleChange
                }
                placeholder="Enter area"
                className="w-full border rounded-2xl px-4 py-3"
              />

            </div>

            {/* AREA UNIT */}

            <div>

              <label className="block mb-2 font-semibold">

                Area Unit

              </label>

              <select
                name="areaUnit"
                value={
                  formData.areaUnit
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-2xl px-4 py-3 bg-white"
              >

                <option value="sqft">
                  Sq Ft
                </option>

                <option value="acre">
                  Acre
                </option>

              </select>

            </div>

          </div>

          {/* ================= LOCATION ================= */}

          <div>

            <label className="block mb-2 font-semibold">

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
              className="w-full border rounded-2xl px-4 py-3"
              required
            />

          </div>

          {/* ================= TYPE ================= */}

          <div>

            <label className="block mb-2 font-semibold">

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
              className="w-full border rounded-2xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Type
              </option>

              <option value="flat">
                Flat
              </option>

              <option value="villa">
                Villa
              </option>

              <option value="house">
                House
              </option>

              <option value="plot">
                Plot
              </option>

              <option value="farm land">
                Farm Land
              </option>

              <option value="office">
                Office
              </option>

            </select>

          </div>

          {/* ================= CONSTRUCTION ================= */}

          <div>

            <label className="block mb-2 font-semibold">

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
              className="w-full border rounded-2xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Status
              </option>

              <option value="ready to move">
                Ready To Move
              </option>

              <option value="under construction">
                Under Construction
              </option>

              <option value="new launch">
                New Launch
              </option>

            </select>

          </div>

          {/* ================= DESCRIPTION ================= */}

          <div>

            <label className="block mb-2 font-semibold">

              Description

            </label>

            <textarea
              rows="4"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="w-full border rounded-2xl px-4 py-3"
            />

          </div>

          {/* ================= MULTIPLE IMAGES ================= */}

          <div>

            <label className="block mb-2 font-semibold">

              Property Images

            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImage
              }
              className="w-full border rounded-2xl px-4 py-3"
            />

            {/* IMAGE PREVIEW */}

            {images.length > 0 && (

              <div className="mt-4 grid grid-cols-3 gap-3">

                {images.map(
                  (img, i) => (

                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="h-24 w-full object-cover rounded-xl border"
                    />
                  )
                )}

              </div>
            )}

          </div>

          {/* ================= BUTTON ================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#071133] text-white py-4 rounded-2xl font-semibold"
          >

            {loading
              ? "Adding..."
              : "Add Property"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProperty;