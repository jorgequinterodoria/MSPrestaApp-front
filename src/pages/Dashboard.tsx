import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";
import { usePermissions } from "../hooks/usePermissions";
import { Users, Wallet, PiggyBank, LogOut, AlertCircle, BarChart } from "lucide-react";
import { Modal } from "../components/Modal";
import { NewLoanForm } from "../components/NewLoanForm";
import { NewClientForm } from "../components/NewClientForm";
import { NewPaymentForm } from "../components/NewPaymentForm";
import Loading from "../components/Loading";
import { LoansTab } from "../components/dashboard/LoansTab";
import { ClientsTab } from "../components/dashboard/ClientsTab";
import { PaymentsTab } from "../components/dashboard/PaymentsTab";


function Dashboard() {
  const [activeTab, setActiveTab] = useState("prestamos");
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  
  const { loans, clients, payments, interestRates,paymentPeriods, loading, error, fetchData } = useDashboardStore();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { can } = usePermissions();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      alert("error: " + error);
    }
  }, [error]);

  const handleLogout = () => {
    setUser(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "prestamos":
        return (
          <LoansTab
            loans={loans}
            clients={clients}
            paymentPeriods={paymentPeriods}
            interestRates={interestRates}
            onNewLoan={() => setShowNewLoanModal(true)}
            canCreateLoan={can("create", "loan")}
          />
        );
       case "clientes":
        return (
          <ClientsTab
            clients={clients}
            loans={loans}
            onNewClient={() => setShowNewClientModal(true)}
            canCreateClient={can("create", "client")}
            onUpdate={fetchData}
          />
        );
       case "pagos":
        return (
          <PaymentsTab
            payments={payments}
            loans={loans}
            clients={clients}
            onNewPayment={() => setShowNewPaymentModal(true)}
            canCreatePayment={can("create", "payment")}
          />
        );  
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:h-16 p-2 md:p-0">
            <div className="flex items-center">
              <h1 className="text-lg md:text-xl font-bold mb-2 md:mb-0">Sistema de Préstamos</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs md:text-sm">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-2 md:flex md:space-x-4 gap-2 mb-6">
              {can("read", "loan") && (
                <button
                  onClick={() => setActiveTab("prestamos")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === "prestamos"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Préstamos
                </button>
              )}

              {can("read", "client") && (
                <button
                  onClick={() => setActiveTab("clientes")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === "clientes"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Clientes
                </button>
              )}

              {can("read", "payment") && (
                <button
                  onClick={() => setActiveTab("pagos")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === "pagos"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <PiggyBank className="h-5 w-5 mr-2" />
                  Pagos
                </button>
              )}

              {can("read", "debt") && (
                <button
                  onClick={() => setActiveTab("moras")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === "moras"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Gestión de Mora
                </button>
              )}

              {can("read", "loan") && can("read", "client") && (
                <button
                  onClick={() => setActiveTab("reportes")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === "reportes"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  Reportes
                </button>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              {renderActiveTab()}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showNewLoanModal}
        onClose={() => setShowNewLoanModal(false)}
        title="Nuevo Préstamo"
      >
        <NewLoanForm
          onClose={() => {
            setShowNewLoanModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        title="Nuevo Cliente"
      >
        <NewClientForm
          onClose={() => {
            setShowNewClientModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        isOpen={showNewPaymentModal}
        onClose={() => setShowNewPaymentModal(false)}
        title="Registrar Pago"
      >
        <NewPaymentForm
          onClose={() => {
            setShowNewPaymentModal(false);
            fetchData();
          }}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
