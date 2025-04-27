import React, { useState, useEffect } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import SideBar from '../SideBar';
import CreateEmloye from '../../../Components/Modals/CreateEmploye';
import EditeEmploye from '../../../Components/Modals/EditeEmploye';
import Table6 from '../../../Components/Table6';
import { Employe as InitialEmployeData } from '../../../Data/HallData';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

function Employes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateEmloyeOpen, setIsCreateEmloyeOpen] = useState(false);
  const [isEditeEmployeOpen, setIsEditeEmployeOpen] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState('');
  const [employees, setEmployees] = useState([]);
  
  // تحميل البيانات الأولية
  useEffect(() => {
    // استخدام البيانات من localStorage إذا كانت موجودة، وإلا استخدام البيانات الافتراضية
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      setEmployees(InitialEmployeData);
    }
  }, []);

  const handleEditClick = (employeeData) => {
    setSelectedEmploye(employeeData);
    setIsEditeEmployeOpen(true);
  };

  const handleEmployeUpdate = (updatedEmployee) => {
    // تحديث الموظف في القائمة
    const updatedEmployees = employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    setEmployees(updatedEmployees);
    
    // حفظ التغييرات في localStorage
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    toast.success(`Employee "${updatedEmployee.name}" updated successfully`);
    setIsEditeEmployeOpen(false);
  };
  
  // دالة لإضافة موظف جديد
  const handleAddEmployee = (newEmployee) => {
    // إضافة معرف فريد إذا لم يكن موجوداً
    if (!newEmployee.id) {
      newEmployee.id = Date.now().toString();
    }
    
    // إضافة الموظف الجديد إلى القائمة
    const newEmployees = [...employees, newEmployee];
    setEmployees(newEmployees);
    
    // حفظ التغييرات في localStorage
    localStorage.setItem('employees', JSON.stringify(newEmployees));
    
    toast.success(`Employee "${newEmployee.userName || newEmployee.name}" added successfully`);
  };

  return (
    <SideBar>
      {/* Create Sidebar */}
      <CreateEmloye
        isOpen={isCreateEmloyeOpen}
        onClose={() => setIsCreateEmloyeOpen(false)}
        employes={employees}
        setEmployes={handleAddEmployee}
      />

      {/* Edit Sidebar */}
      <EditeEmploye
  isOpen={isEditeEmployeOpen}
  onClose={() => setIsEditeEmployeOpen(false)}
  employe={selectedEmploye} 
  onEdit={handleEmployeUpdate}
/>


      <div className="flex flex-col gap-6">
            <div className="flex items-center justify-start w-3/4">
                                              <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md">
                                                <button
                                                  type="button"
                                                  onClick={() => console.log('Search button clicked')}
                                                  className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
                                                >
                                                  <FaSearch />
                                                </button>
                                                <input
                                                  type="text"
                                                  placeholder="Search Employe ID"
                                                  value={searchQuery}
                                                  onChange={(e) => setSearchQuery(e.target.value)}
                                                  className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
                                                />
                                              </form>
                                            </div>
        {/* Header */}
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-bold">Employes</h2>
          <button
            onClick={() => setIsCreateEmloyeOpen(true)}
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-xl hover:bg-main border border-beige3 transition"
          >
            <HiPlusCircle className="text-lg" /> Create
          </button>
        </div>

        {/* Table */}
        <Table6
          data={employees}
          employes={true}
          onEditClick={handleEditClick} 
        />
      </div>
    </SideBar>
  );
}

export default Employes;
