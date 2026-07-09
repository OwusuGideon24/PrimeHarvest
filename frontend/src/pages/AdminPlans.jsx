/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import PlanTable from "../components/admin/PlanTable";
import PlanModal from "../components/admin/PlanModal";

function AdminPlans() {

  const [plans, setPlans] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  const fetchPlans = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlans(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchPlans();

  }, []);

  return (

    <div className="flex min-h-screen bg-slate-100">

      <AdminSidebar />

      <div className="flex-1 p-8">

        <AdminHeader />

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">

            Investment Plans

          </h1>

          <button
            onClick={() => {

              setEditingPlan(null);

              setShowModal(true);

            }}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            + Add Plan
          </button>

        </div>

        <PlanTable

          plans={plans}

          refresh={fetchPlans}

          editPlan={(plan) => {

            setEditingPlan(plan);

            setShowModal(true);

          }}

        />

      </div>

      {showModal && (

        <PlanModal

          plan={editingPlan}

          close={() => setShowModal(false)}

          refresh={() => {

            fetchPlans();

            setShowModal(false);

          }}

        />

      )}

    </div>

  );

}

export default AdminPlans;