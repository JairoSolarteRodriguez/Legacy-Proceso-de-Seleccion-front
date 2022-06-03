import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import StaffSelect from './StaffSelect';
import "./ModeratorInterviewer_Viewer.css";
import { setDate } from "date-fns/esm";

const ModeratorViewer = () => {
  const [users, setUsers] = useState([]);
  const [citation, setCitation] = useState([]);
  const [citationSelected, setCitationSelected] = useState([]);
  const [IdCitation, setIdCitation] = useState([]);
  const [date, setDate] = useState([]);
  const [UsersSelected, setUsersSelected] = useState([]);
  const [currentSelectors, setCurrentSelectors] = useState([]);
  const [currentAvailableId, setCurrentAvailableId] = useState("");

  const token = useSelector((state) => state.token);

  //connect users staff endpoint
  async function fetchUser() {
    const { data } = await axios.get(
      "http://localhost:3001/api/user/roles_meeting_info",
      {
        headers: { Authorization: token },
      }
    );
    setUsers(data);
    //setUsersSelected(data[0]);
  }

  //connect citations info endpoint
  async function fetchCitation() {
    const { data } = await axios.get(
      "http://localhost:3001/api/admin/citation-all",
      {
        headers: { Authorization: token },
      }
    );
    setCitation(data.data);
  }

  async function fetchCitationSelected() {
    const { data } = await axios.get(
      `http://localhost:3001/api/admin/citationFilter/${IdCitation}`,
      {
        headers: { Authorization: token },
      }
    );

    setCitationSelected(data);
  }

  async function fetchAvailability() {
    const { data } = await axios.get(
      `http://localhost:3001/api/admin/available-id/${IdCitation}`
    );

    if (data.data.length !== 0) {
      setCurrentSelectors(data.data[0].selectors);
      setUsersSelected(data.data[0].selectors);
      setCurrentAvailableId(data.data[0]._id);
    } else {
      setCurrentSelectors([]);
      setUsersSelected([]);
      setCurrentAvailableId("");
    }
  }

  useEffect(() => {
    fetchUser();
    fetchCitation();
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [IdCitation]);

  const toggleChecked = (e) => {
    if (UsersSelected.findIndex((user) => user._id == e.target.value) !== -1) {
      const selector = UsersSelected.findIndex(
        (user) => user._id == e.target.value
      );

      UsersSelected.splice(selector, 1);
      setUsersSelected([...UsersSelected]);
    } else {
      const selector = users.find((user) => user._id == e.target.value);
      setUsersSelected([...UsersSelected, selector]);
    }
  };

  // Post availability staff
  const postAvailability = () => {
    fetchCitationSelected();

    const selectors = UsersSelected.map((dat) => {
      return {
        _id: dat._id,
        names: dat.names,
        surname: dat.surname,
        role: dat.role,
        meetRole: 4,
      };
    });

    if (currentAvailableId.length !== 0) {
      axios.put(
        `http://localhost:3001/api/admin/update_availables/${currentAvailableId}`,
        { ...selectors }
      );
    } else {
      const newAvailability = {
        citationID: IdCitation,
        date: date,
        shift: "mañana",
        selectors,
      };

      axios.post("http://localhost:3001/api/admin/availability", {
        ...newAvailability,
      });
    }

    // const citationAvailability = axios.get(`http://localhost:3001/api/admin/findCitationid/${citation.ID}`);
  };

  //const deleteAvailability = () => {
  //  const id_available=UsersSelected._id;
  //  axios.delete(`http://localhost:3001/api/admin/deleteAvailability/${id_available}`);
  //  };

  const handleSelect = (e) => {
    let index = e.target.selectedIndex;
    let date = e.target.options[index].text;
    setDate(date);
    setIdCitation(e.target.value);
  };

  return (
    <>
      <div className="moderatorContainer">
        <div className="moderatorInterviewerContainer">
          <h1 className="moderatorInterviewerTitle">MODERADOR - OBSERVADOR</h1>

          <select onChange={handleSelect}>
            <option value="">Seleccione una fecha</option>
            {citation.map((cita) => (
              <option value={cita._id}>
                {`${cita.appointmentDate.toString().slice(0, -14)}
               ${cita.shift}`}{" "}
              </option>
            ))}
          </select>

          <table>
            <tr>
              <th>Entrevistador</th>
              <th>Assign rol</th>
              <th>Available date</th>
              <th>Available shift</th>
              <th>Assign</th>
            </tr>
            {currentSelectors?.length !== 0 ? (
              currentSelectors?.map((staff) => (
                <tr>
                  <td>
                    {staff.names} {staff.surname}
                  </td>
                  <td>{staff.role}</td>
                  <td>{date}</td>

                  <td>
                    <input
                      value={staff._id}
                      type="checkbox"
                      name="id"
                      checked={true}
                      onChange={toggleChecked}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
            {users.map((staff) =>
              currentSelectors.findIndex((user) => user._id == staff._id) !==
              -1 ? (
                <></>
              ) : (
                <tr>
                  <td>
                    {staff.names} {staff.surname}
                  </td>
                  <td>{staff.role}</td>
                  <td>{date}</td>

                  <td>
                    <input
                      value={staff._id}
                      type="checkbox"
                      name="id"
                      onChange={toggleChecked}
                    />
                  </td>
                </tr>
              )
            )}
          </table>
          <button onClick={postAvailability}>Assign</button>
        </div>
      </div>
    </>
  );
};

export default ModeratorViewer;