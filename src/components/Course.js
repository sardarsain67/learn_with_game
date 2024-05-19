import React, { useState } from "react";
import "../assests/css/course.css";
import {useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminAuthToken");

    if (!adminAuthToken) {
      navigate("/admin");
    }
  }, [navigate]);



  const [courseName, setCourseName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [numModules, setNumModules] = useState(0); // Initially set to 0
  const [moduleNames, setModuleNames] = useState([]);
  const [headings, setHeadings] = useState([]);

  const handleNumModulesChange = (e) => {
    const num = parseInt(e.target.value);
    setNumModules(num);
    const names = Array.from({ length: num }, () => ""); // Initialize array with empty strings
    setModuleNames(names);
    const newHeadings = [];
    for (let i = 0; i < num; i++) {
      newHeadings.push({ moduleName: "", heading: "", content: "" }); // Initialize headings with empty strings
    }
    setHeadings(newHeadings);
  };

  const handleAddHeadingField = () => {
    setHeadings([...headings, { moduleName: "", heading: "", content: "" }]);
  };

  const handleRemoveHeadingField = (index) => {
    const updatedHeadings = [...headings];
    updatedHeadings.splice(index, 1);
    setHeadings(updatedHeadings);
  };

  const handleChange = (index, field, e) => {
    const { value } = e.target;
    const newHeadings = [...headings];
    newHeadings[index][field] = value;
    setHeadings(newHeadings);

    // Update moduleNames array when the moduleName field changes
    if (field === "moduleName") {
      const newModuleNames = [...moduleNames];
      newModuleNames[index] = value;
      setModuleNames(newModuleNames);
    }
  };

  const resetForm = () => {
    setCourseName("");
    setShortDescription("");
    setNumModules(0); // Reset to 0
    setModuleNames([]);
    setHeadings([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm(
      "Are you sure you want to submit this course?"
    );
    if (!confirmation) return;

    try {
      const requestData = {
        courseName,
        shortDescription,
        numModules,
        moduleNames,
        headings,
      };

      console.log("Sending data:", requestData); // Log the data being sent

      const response = await fetch(
        "http://localhost:80/learning_with_gaming/php/admin/course/add_course.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const data = await response.json();
      console.log(data.message); // Message from the server
      // Reset the form fields
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="courseMain">
      <div className="container">
        <h2 className="title">Add Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="courseName" className="form-label">
              Course Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="shortDescription" className="form-label">
              Short Description:
            </label>
            <textarea
              className="form-control"
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="numModules" className="form-label">
              Number of Modules:
            </label>
            <select
              className="form-select"
              id="numModules"
              value={numModules}
              onChange={handleNumModulesChange}
            >
              {[0, 1, 2, 3].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          {headings.map((heading, index) => (
            <div key={index} className="mb-3">
              <label htmlFor={`moduleName${index}`} className="form-label">
                Module Name:
              </label>
              <input
                type="text"
                className="form-control"
                id={`moduleName${index}`}
                name={`headings[${index}][moduleName]`}
                value={heading.moduleName}
                onChange={(e) => handleChange(index, "moduleName", e)}
                placeholder="Module Name"
                required
              />

              <div className="mb-3">
                <label htmlFor={`heading${index}`} className="form-label">
                  Heading:
                </label>
                <textarea
                  className="form-control"
                  id={`heading${index}`}
                  name={`headings[${index}][heading]`}
                  value={heading.heading}
                  onChange={(e) => handleChange(index, "heading", e)}
                  placeholder="Heading"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor={`content${index}`} className="form-label">
                  Content:
                </label>
                <textarea
                  className="form-control"
                  id={`content${index}`}
                  name={`headings[${index}][content]`}
                  value={heading.content}
                  onChange={(e) => handleChange(index, "content", e)}
                  placeholder="Content"
                  required
                ></textarea>
              </div>
              {headings.length > 1 && (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleRemoveHeadingField(index)}
                >
                  Remove
                </button>
              )}
              {index === headings.length - 1 && (
                <button
                  className="btn btn-outline-secondary ms-2 add-heading"
                  type="button"
                  onClick={handleAddHeadingField}
                >
                  Add Heading
                </button>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary my-2">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default Course;

// import React, { useState } from "react";

// const Course = () => {
//   const [courseName, setCourseName] = useState("");
//   const [shortDescription, setShortDescription] = useState("");
//   const [numModules, setNumModules] = useState(0); // Initially set to 0
//   const [moduleNames, setModuleNames] = useState([]);
//   const [headings, setHeadings] = useState([]);

//   const handleNumModulesChange = (e) => {
//     const num = parseInt(e.target.value);
//     setNumModules(num);
//     const names = Array.from({ length: num }, () => ""); // Initialize array with empty strings
//     setModuleNames(names);
//     const newHeadings = [];
//     for (let i = 0; i < num; i++) {
//       newHeadings.push({ moduleName: "", heading: "", content: "" }); // Initialize headings with empty strings
//     }
//     setHeadings(newHeadings);
//   };

//   const handleAddHeadingField = () => {
//     setHeadings([...headings, { moduleName: "", heading: "", content: "" }]);
//   };

//   const handleRemoveHeadingField = (index) => {
//     const updatedHeadings = [...headings];
//     updatedHeadings.splice(index, 1);
//     setHeadings(updatedHeadings);
//   };

//   const handleChange = (index, field, e) => {
//     const { value } = e.target;
//     const newHeadings = [...headings];
//     newHeadings[index][field] = value;
//     setHeadings(newHeadings);

//     // Update moduleNames array when the moduleName field changes
//     if (field === "moduleName") {
//       const newModuleNames = [...moduleNames];
//       newModuleNames[index] = value;
//       setModuleNames(newModuleNames);
//     }
//   };

//   const resetForm = () => {
//     setCourseName("");
//     setShortDescription("");
//     setNumModules(0); // Reset to 0
//     setModuleNames([]);
//     setHeadings([]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const confirmation = window.confirm(
//       "Are you sure you want to submit this course?"
//     );
//     if (!confirmation) return;

//     try {
//       const requestData = {
//         courseName,
//         shortDescription,
//         numModules,
//         moduleNames,
//         headings,
//       };

//       console.log("Sending data:", requestData); // Log the data being sent

//       const response = await fetch(
//         "http://localhost:80/Learn-Gaming-React-With-PHP/learn_with_game/php/admin/course/add_course.php",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to add course");
//       }

//       const data = await response.json();
//       console.log(data.message); // Message from the server
//       // Reset the form fields
//       resetForm();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <section className="courseMain">
//       <div className="container">
//         <h2 className="title">Add Course</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="courseName" className="form-label">
//               Course Name:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="courseName"
//               value={courseName}
//               onChange={(e) => setCourseName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="shortDescription" className="form-label">
//               Short Description:
//             </label>
//             <textarea
//               className="form-control"
//               id="shortDescription"
//               value={shortDescription}
//               onChange={(e) => setShortDescription(e.target.value)}
//               required
//             ></textarea>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="numModules" className="form-label">
//               Number of Modules:
//             </label>
//             <select
//               className="form-select"
//               id="numModules"
//               value={numModules}
//               onChange={handleNumModulesChange}
//             >
//               {[0, 1, 2, 3].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {headings.map((heading, index) => (
//             <div key={index} className="mb-3">
//               <label htmlFor={`moduleName${index}`} className="form-label">
//                 Module Name:
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id={`moduleName${index}`}
//                 name={`headings[${index}][moduleName]`}
//                 value={heading.moduleName}
//                 onChange={(e) => handleChange(index, "moduleName", e)}
//                 placeholder="Module Name"
//                 required
//               />

//               <div className="mb-3">
//                 <label htmlFor={`heading${index}`} className="form-label">
//                   Heading:
//                 </label>
//                 <textarea
//                   className="form-control"
//                   id={`heading${index}`}
//                   name={`headings[${index}][heading]`}
//                   value={heading.heading}
//                   onChange={(e) => handleChange(index, "heading", e)}
//                   placeholder="Heading"
//                   required
//                 ></textarea>
//               </div>
//               <div className="mb-3">
//                 <label htmlFor={`content${index}`} className="form-label">
//                   Content:
//                 </label>
//                 <textarea
//                   className="form-control"
//                   id={`content${index}`}
//                   name={`headings[${index}][content]`}
//                   value={heading.content}
//                   onChange={(e) => handleChange(index, "content", e)}
//                   placeholder="Content"
//                   required
//                 ></textarea>
//               </div>
//               {headings.length > 1 && (
//                 <button
//                   className="btn btn-danger"
//                   type="button"
//                   onClick={() => handleRemoveHeadingField(index)}
//                 >
//                   Remove
//                 </button>
//               )}
//               {index === headings.length - 1 && (
//                 <button
//                   className="btn btn-outline-secondary ms-2"
//                   type="button"
//                   onClick={handleAddHeadingField}
//                 >
//                   Add Heading
//                 </button>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="btn btn-primary my-2">
//             Submit
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Course;
