import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import EditProduct from "../components/EditProduct";

const EditProductPage = () => {
  return (
    <div>
      <div className="my-5">
        <BreadCrumb />
      </div>
      <EditProduct />
    </div>
  );
};

export default EditProductPage;
