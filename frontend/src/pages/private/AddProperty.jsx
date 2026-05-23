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

      const files =
        Array.from(
          e.target.files
        );

      setImages(files);
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

    <div className="min-h-screen bg-slate-100 py-8 px-4">

      <div className="max-w-4xl mx-auto bg-white rounded-[28px] shadow-sm p-6 md:p-8">

        {/* TITLE */}

        <h1 className="text-3xl md:text-4xl font-black text-[#071133] mb-8">

          Add New Property

        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* TITLE */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">

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
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              required
            />

          </div>

          {/* PRICE */}

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="block mb-2 font-semibold text-slate-700">

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
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                required
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold text-slate-700">

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
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-blue-500"
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

          {/* AREA */}

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="block mb-2 font-semibold text-slate-700">

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
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold text-slate-700">

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
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-blue-500"
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

          {/* LOCATION */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">

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
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              required
            />

          </div>

          {/* TYPE */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">

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
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-blue-500"
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

              <option value="agriculture land">
                Agriculture Land
              </option>

              <option value="office">
                Office
              </option>

            </select>

          </div>

          {/* CONSTRUCTION STATUS */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">

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
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-blue-500"
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

          {/* DESCRIPTION */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">

              Description

            </label>

            <textarea
              rows="5"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none resize-none focus:border-blue-500"
            />

          </div>

          {/* MULTIPLE IMAGE UPLOAD */}

          <div>

            <label className="block mb-3 font-semibold text-slate-700">

              Property Images

            </label>

            <label
              htmlFor="propertyImages"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-500 transition-all bg-slate-50"
            >

              <div className="text-center">

                <p className="text-lg font-semibold text-slate-700">

                  Upload Property Images

                </p>

                <p className="text-sm text-slate-500 mt-1">

                  Select multiple images

                </p>

              </div>

              <input
                id="propertyImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImage}
                className="hidden"
              />

            </label>

            {/* IMAGE PREVIEW */}

            {images.length > 0 && (

              <div className="mt-5">

                <p className="font-semibold mb-3">

                  Selected Images
                  {" "}
                  ({images.length})

                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {images.map(
                    (img, i) => (

                      <div
                        key={i}
                        className="relative"
                      >

                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="h-28 w-full object-cover rounded-2xl border shadow-sm"
                        />

                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">

                          {i + 1}

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#071133] hover:bg-[#0d1b4d] transition-all text-white py-4 rounded-2xl font-semibold text-lg"
          >

            {loading
              ? "Adding Property..."
              : "Add Property"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProperty;