import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./api/route";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
// import { Tag } from "primereact/tag";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSearch,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
export default function ProductsDemo() {
  let emptyProduct = {
    code: null,
    name: "",
    category: null,
    price: 0,
    available: true,
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };
  //show select item id
  // console.log("selectedProducts", selectedProducts);

  // show create product 
  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setProduct(emptyProduct)
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
    setProduct(emptyProduct)
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
        let _products = [...products];
        let _product = { ...product };

        if (product.code) {
            const index = findIndexById(product.code);

            _products[index] = _product;
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Product Updated",
                life: 3000,
            });
            ProductService.updateProduct(_product);
        } else {
            _product.code = createId();
            _products.push(_product);
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Product Created",
                life: 3000,
            });
            console.log("Product:", _product);
            ProductService.createProduct(_product);
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
        
    }
};


  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.code !== product.code);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
    ProductService.deleteProduct(product.code);
  };

  const findIndexById = (code) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].code === code) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };

    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" severity="success" onClick={openNew}></Button>
        <Button
          label="Delete"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        >
          <FontAwesomeIcon icon={faTrash} className="mx-0.5 text-xl" />
        </Button>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button label="Export" className="p-button-help" onClick={exportCSV}>
        <FontAwesomeIcon icon={faUpload} className="mx-0.5 text-xl" />
      </Button>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };

  // const statusBodyTemplate = (rowData) => {
  //   return (
  //     <Tag
  //       value={rowData.inventoryStatus}
  //       severity={getSeverity(rowData)}
  //     ></Tag>
  //   );
  // };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        >
          <FontAwesomeIcon icon={faEdit} className="text-2xl" />
        </Button>
        <Button
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        >
          <FontAwesomeIcon icon={faTrash} className="text-2xl" />
        </Button>
      </React.Fragment>
    );
  };

  // const getSeverity = (product) => {
  //   switch (product.inventoryStatus) {
  //     case "INSTOCK":
  //       return "success";

  //     case "LOWSTOCK":
  //       return "warning";

  //     case "OUTOFSTOCK":
  //       return "danger";

  //     default:
  //       return null;
  //   }
  // };


  // const handleInput = async (e) => {
  //   const value = e.target.value;
  //   console.log("Search Input:", value); 
  //   setGlobalFilter(value);
  //   const results = await ProductService.searchProducts(value);
  //   setProducts(results); 
  // };
  
  const handleInput = (e) => {
    const value = e.target.value;
    console.log("Search Input:", value); 
    setGlobalFilter(value);
  };
  
  const handleSearchClick = async () => {
    console.log("Search Input:", globalFilter);
    try {
      const results = await ProductService.searchProducts(globalFilter, null, null, null, null);
      setProducts(results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };
  
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-end">
      <h4 className="m-0">Manage Products</h4>
      <IconField iconPosition="left">
        <InputText
          type="search"
          value={globalFilter}
          onInput={handleInput}
          placeholder="Search..."
          className="border-2"
        />
        <Button icon={<FontAwesomeIcon icon={faSearch} />} className="ml-2" onClick={handleSearchClick} />
      </IconField>
    </div>
  );

  


  
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="fa fa-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="code"
          paginator
          stripedRows
          dragSelection
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            selectionMode="multiple"
            exportable={false}
            headerStyle={{
              minWidth: "9rem",
              backgroundColor: "#344a5f",
              color: "white",
              textTransform: "uppercase",
              overflow: "auto",
              textAlign: "center",
            }}
          ></Column>
          
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "16rem" }}
            headerStyle={{
              minWidth: "9rem",
              backgroundColor: "#344a5f",
              color: "white",
              textTransform: "uppercase",
              overflow: "auto",
              textAlign: "center",
            }}
          ></Column>

          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
            headerStyle={{
              minWidth: "9rem",
              backgroundColor: "#344a5f",
              color: "white",
              textTransform: "uppercase",
              overflow: "auto",
              textAlign: "center",
            }}
          ></Column>
          <Column
            field="category"
            header="Category"
            sortable
            style={{ minWidth: "10rem" }}
            headerStyle={{
              minWidth: "9rem",
              backgroundColor: "#344a5f",
              color: "white",
              textTransform: "uppercase",
              overflow: "auto",
              textAlign: "center",
            }}
          ></Column>

          
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
            headerStyle={{
              minWidth: "9rem",
              backgroundColor: "#344a5f",
              color: "white",
              textTransform: "uppercase",
              overflow: "auto",
              textAlign: "center",
            }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{
          width: "32rem",
          margin: "auto",
          marginTop: "5rem",
          height: "fit-content",
        }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
        headerStyle={{
          minWidth: "9rem",
          backgroundColor: "#344a5f",
          color: "white",
          textTransform: "uppercase",
          overflow: "auto",
          textAlign: "left",
        }}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name
          </label>
          <InputText
            id="name"
            value={product.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames("h-8 border-2", {
              "p-invalid": submitted && !product.name,
            })}
          />
          {submitted && !product.name && (
            <small className="p-error">Name is required.</small>
          )}
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Category</label>
          <div className="grid grid-rows-2 grid-flow-col gap-4 my-2">
            <div className="">
              <RadioButton
                inputId="category1"
                name="category"
                value="Accessories"
                onChange={onCategoryChange}
                checked={product.category === "Accessories"}
                className="border-2 rounded-full my-auto"
              />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="">
              <RadioButton
                inputId="category2"
                name="category"
                value="Clothing"
                onChange={onCategoryChange}
                checked={product.category === "Clothing"}
                className="border-2 rounded-full my-auto"
              />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category3"
                name="category"
                value="Electronics"
                onChange={onCategoryChange}
                checked={product.category === "Electronics"}
                className="border-2 rounded-full my-auto"
              />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category4"
                name="category"
                value="Fitness"
                onChange={onCategoryChange}
                checked={product.category === "Fitness"}
                className="border-2 rounded-full my-auto"
              />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price" className="font-bold">
              Price
            </label>
            <InputNumber
              id="price"
              value={product.price}
              onValueChange={(e) => onInputNumberChange(e, "price")}
              mode="currency"
              currency="USD"
              locale="en-US"
              className="border-2 rounded-md my-auto h-8"
            />
          </div>
          
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}