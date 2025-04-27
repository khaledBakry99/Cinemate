import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import { CategoriesData } from "../../../Data/CategoriesData";
import { ImUpload } from "react-icons/im";
import EditCastModal from "../../../Components/Modals/EditCastModal";
import AddCastModal from "../../../Components/Modals/AddCastModal";
import DeleteConfirmModal from "../../../Components/Modals/DeleteConfirmModal";
import TemporaryModal from "../../../Components/TemporaryModal";
import { castService, imageService } from "../../../api/services";

// Import new components
import MovieForm from "../../../Components/Movie/MovieForm";
import MovieImages from "../../../Components/Movie/MovieImages";
import MovieDescription from "../../../Components/Movie/MovieDescription";
import CastSection from "../../../Components/Movie/CastSection";

function AddMovie() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null);
  const [castToDelete, setCastToDelete] = useState(null);

  // حالة الشاشة المنبثقة المؤقتة
  const [tempModal, setTempModal] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // حالات اللغات واخرى
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear()); // السنة الحالية كقيمة افتراضية

  // قائمة اللغات الشائعة
  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "hi", name: "Hindi" },
    { code: "tr", name: "Turkish" },
  ];

  // حالة طاقم التمثيل
  const [castMembers, setCastMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // حالة التصفية والترتيب
  const [castType, setCastType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(8);

  // جلب الفئات
  useEffect(() => {
    setCategories(CategoriesData);
  }, []);

  // دالة لجلب اللغات من API (للاستخدام المستقبلي)
  const fetchLanguages = async () => {
    try {
      // هنا يمكن استدعاء API للغات
      // مثال:
      // const response = await axios.get('http://cinemate-001-site1.jtempurl.com/api/Languages');
      // if (response.data && response.data.success) {
      //   setLanguages(response.data.data);
      // }

      // حالياً نستخدم القائمة المحلية
      console.log("Using local languages list");
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  // استدعاء دالة جلب اللغات عند تحميل الصفحة
  useEffect(() => {
    fetchLanguages();
  }, []);

  // دالة جلب طاقم التمثيل
  const fetchCast = async () => {
    try {
      setIsLoading(true);
      console.log("Attempting to fetch cast using castService");

      // إعداد معلمات البحث
      const params = {
        CastType: castType.toUpperCase(), // تحويل إلى أحرف كبيرة للتوافق مع API
        PageIndex: currentPage - 1, // تعديل الفهرس ليبدأ من 0
        PageSize: pageSize,
        SearchQuery: "",
      };

      // إذا كان نوع طاقم التمثيل فارغاً، نحذف المعلمة
      if (!castType) {
        delete params.CastType;
      }

      console.log("Fetching cast with params:", params);

      // استدعاء خدمة castService
      const response = await castService.getCast(params);

      console.log("Cast API response:", response.data);

      // معالجة البيانات المستلمة
      if (response.data && response.data.success) {
        const apiData = response.data.data;
        console.log("Cast API response:", apiData);

        // تحقق من تنسيق البيانات
        console.log("Raw API response format:", apiData);

        // معالجة البيانات
        const processedData = {
          items: [],
          totalCount: 0,
          totalPages: 0,
        };

        // معالجة العناصر إذا كانت موجودة
        if (Array.isArray(apiData)) {
          processedData.items = apiData.map((item) => {
            console.log("Processing cast item:", item);

            // استخراج الاسم الكامل
            const fullName = `${item.firstName || ""} ${
              item.lastName || ""
            }`.trim();

            // استخراج معلومات الصورة
            let imageUrl = "/images/user.png"; // الصورة الافتراضية
            let imageId = null;

            if (item.image) {
              imageId = item.image.id;

              // استخراج عنوان URL للصورة
              if (item.image.url) {
                const imagePath = item.image.url;
                console.log(`Image for ${fullName}: ${imagePath}`);

                // التحقق مما إذا كان المسار يبدأ بـ http
                if (imagePath.startsWith("http")) {
                  imageUrl = imagePath;
                } else {
                  // إضافة البروتوكول ونطاق الخادم إذا كان المسار نسبياً
                  imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
                }
              }
            }

            // إنشاء كائن الممثل
            return {
              id: item.id,
              name: fullName,
              firstName: item.firstName,
              lastName: item.lastName,
              castType: item.castType === "ACTOR" ? "Actor" : "Director",
              image: item.image ? item.image.url : "user.png",
              imageUrl: imageUrl,
              imageId: imageId,
            };
          });

          // تعيين إجمالي العدد والصفحات
          processedData.totalCount = apiData.length;
          processedData.totalPages = Math.ceil(apiData.length / pageSize);
        }

        console.log("Processed API data:", processedData);

        // تحديث حالة المكون
        setCastMembers(processedData.items);
        setTotalPages(processedData.totalPages || 1);
      } else {
        console.error("API returned unsuccessful response:", response.data);
        setError("Failed to fetch cast members. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching cast:", err);
      setError("An error occurred while fetching cast members.");
    } finally {
      setIsLoading(false);
    }
  };

  // جلب طاقم التمثيل عند تغيير الصفحة أو نوع طاقم التمثيل
  useEffect(() => {
    fetchCast();
  }, [currentPage, castType]);

  // دالة تغيير الفئة
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // دالة فتح مودال التعديل
  const handleEditCast = (cast) => {
    setSelectedCast(cast);
    setIsEditModalOpen(true);
  };

  // دالة إغلاق مودال التعديل
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCast(null);
  };

  // دوال التعامل مع مودال التأكيد على الحذف
  const openDeleteModal = (cast) => {
    setCastToDelete(cast);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCastToDelete(null);
  };

  // دالة عرض الشاشة المنبثقة المؤقتة
  const showTempModal = (message, type = "success") => {
    setTempModal({
      show: true,
      message,
      type,
    });

    // إخفاء الشاشة المنبثقة بعد ثانيتين
    setTimeout(() => {
      setTempModal((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2000);
  };

  // دالة فتح مودال الإضافة
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // دالة إغلاق مودال الإضافة
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // دالة إضافة ممثل
  const handleAddCast = (newCast) => {
    setCastMembers((prev) => [newCast, ...prev]);
  };

  // دالة تحديث ممثل
  const handleUpdateCast = (updatedCast) => {
    console.log("Updating cast in UI:", updatedCast);

    // تحديث قائمة الممثلين مع الحفاظ على معلومات الصورة
    setCastMembers((prev) =>
      prev.map((cast) => {
        if (cast.id === updatedCast.id) {
          // الاحتفاظ بمعلومات الصورة الأصلية إذا لم يتم تحديثها
          const imageUrl = updatedCast.imageUrl || cast.imageUrl;

          console.log(
            `Updated cast ${updatedCast.id} (${updatedCast.name}): imageUrl=${imageUrl}`
          );

          return {
            ...cast,
            ...updatedCast,
            imageUrl: imageUrl,
          };
        }
        return cast;
      })
    );

    // عرض رسالة نجاح
    showTempModal("Cast member updated successfully", "success");
  };

  // دالة حذف ممثل
  const handleDeleteCast = async (castId) => {
    try {
      setIsLoading(true);

      // حذف الممثل من الخادم باستخدام خدمة castService
      const deleteResponse = await castService.deleteCast(castId);

      console.log("Delete cast response:", deleteResponse.data);

      // محاولة حذف الصورة المرتبطة (إذا وجدت) باستخدام خدمة imageService
      try {
        await imageService.deleteImage(castId);
        console.log("Image deleted successfully");
      } catch (imageError) {
        console.log(
          "Note: Could not delete image or no image exists:",
          imageError
        );
        // لا نريد إيقاف العملية بسبب فشل حذف الصورة
      }

      // تحديث واجهة المستخدم
      setCastMembers((prev) => prev.filter((cast) => cast.id !== castId));

      // عرض رسالة نجاح
      showTempModal("Cast member deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting cast member:", err);

      // عرض رسالة خطأ أكثر تفصيلاً
      let errorMessage = "Failed to delete cast member. Please try again.";

      if (err.response) {
        errorMessage = `Server error (${err.response.status}): ${
          err.response.data?.message || err.response.statusText
        }`;
      } else if (err.request) {
        errorMessage = "Network error: Could not connect to the server.";
      }

      setError(errorMessage);
      showTempModal(errorMessage, "error");
    } finally {
      setIsLoading(false);
      closeDeleteModal();
    }
  };

  // دالة فتح مودال التأكيد على الحذف
  const confirmDeleteCast = (cast) => {
    setCastToDelete(cast);
    setIsDeleteModalOpen(true);
  };

  // دالة تغيير نوع طاقم التمثيل
  const handleCastTypeChange = (type) => {
    setCastType(type);
    setCurrentPage(1); // إعادة التعيين إلى الصفحة الأولى عند تغيير النوع
  };

  // دالة نشر الفيلم
  const handlePublishMovie = () => {
    // التحقق من اختيار اللغات
    if (!selectedLanguage) {
      showTempModal("Please select a language", "error");
      return;
    }

    if (!selectedTranslation) {
      showTempModal("Please select a translation language", "error");
      return;
    }

    // هنا يمكن إرسال بيانات الفيلم إلى API
    // مثال:
    const movieData = {
      // بيانات الفيلم الأخرى
      languageCode: selectedLanguage,
      translationCode: selectedTranslation,
      releaseYear: releaseYear,
      // يمكن إضافة المزيد من البيانات هنا
    };

    console.log("Publishing movie with data:", movieData);

    // عرض رسالة نجاح
    showTempModal("Movie published successfully", "success");
  };

  // دالة الانتقال إلى الصفحة السابقة
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // دالة الانتقال إلى الصفحة التالية
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Create Movie</h2>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="w-full">
            <MovieForm
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              releaseYear={releaseYear}
              setReleaseYear={setReleaseYear}
              languages={languages}
              categories={categories}
            />
            <div className="mt-6">
              <MovieImages />
            </div>
            <div className="mt-6">
              <MovieDescription />
            </div>
            <div className="mt-6">
              <button
                onClick={handlePublishMovie}
                className="bg-beige3 w-full flex-rows gap-6 font-medium transitions hover:bg-dry border border-beige3 flex-rows text-white py-4 rounded-2xl transition-transform duration-300 hover:scale-95"
              >
                <ImUpload /> Publish Movie
              </button>
            </div>
          </div>

          <div className="w-full">
            <CastSection
              castType={castType}
              handleCastTypeChange={handleCastTypeChange}
              castMembers={castMembers}
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={isLoading}
              handleEditCast={handleEditCast}
              confirmDeleteCast={confirmDeleteCast}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              openAddModal={openAddModal}
            />
          </div>
        </div>
      </div>

      {/* Add Cast Modal */}
      <AddCastModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddCast={handleAddCast}
      />

      {/* Edit Cast Modal */}
      <EditCastModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        cast={selectedCast}
        onUpdateCast={handleUpdateCast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => castToDelete && handleDeleteCast(castToDelete.id)}
        title="Delete Cast Member"
        message={`Are you sure you want to delete ${castToDelete?.name}?`}
      />

      {/* Temporary Modal */}
      <TemporaryModal
        isVisible={tempModal.show}
        message={tempModal.message}
        type={tempModal.type}
        onClose={() => setTempModal((prev) => ({ ...prev, show: false }))}
      />
    </SideBar>
  );
}

export default AddMovie;
