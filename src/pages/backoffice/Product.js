import Swal from "sweetalert2";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import { useEffect, useRef, useState } from "react";
import config from "../../config";
import axios from "axios";

function Product () {
    const [product, setProduct] = useState({}); //Create, Update
    const [products, setProducts] = useState([]); //Show all
    const [img, setImg] = useState({}); //file for upload
    const [fileExcel, setFileExcel] = useState({});
    const refImg = useRef();
    const refExcel = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('img', img);

            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (res.data.newName !== undefined) {
                return res.data.newName;
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
        return "";
    }


    const handleSave = async () => {
        try {
            product.img = await handleUpload();
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            let res;
            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
               res = await axios.put(config.apiPath + '/product/update', product, config.headers());
            }

            if(res.data.message === 'success') {
                Swal.fire({
                    title: 'Save',
                    text: 'success',
                    icon: 'success',
                    timer: 1000 //millisec
                });
                document.getElementById('modalProduct_btnClose').click();
                fetchData();

                setProduct({...product, id: undefined}); //Clear id
            }
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());

            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        })
        setImg(null);
        refImg.current.value = '';
    }


    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                text: 'remove item',
                title: 'remove',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (button.isConfirmed){
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'remove',
                        text: 'remove success',
                        icon: 'success',
                        timer: 1000
                    })

                    fetchData();
                }
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon:'error'
            })
        }
    }

    const selectedFile = (inputFile) => {
        if (inputFile !== undefined) {
            if (inputFile.length > 0) {
                setImg(inputFile[0]);
            }
        }
    }

    const selectedFileExcel = (fileInput) => {
        if (fileInput !== undefined) {
            if (fileInput.length > 0) {
                setFileExcel(fileInput[0]);
            }
        }
    }

    const handleUploadExcel = async () => {
        try {
            const formData = new FormData();    //for send file to backend (binary: .img .zip .xlsx .exe .rar)
            formData.append('fileExcel', fileExcel);

            const res = await axios.post(config.apiPath + '/product/uploadFromExcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'Save',
                    text: 'success',
                    icon: 'success',
                    timer: 1000 //millisec
                });

                fetchData();

                document.getElementById('modalExcel_btnClose').click();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    
    const clearFormExcel = () => {
        refExcel.current.value = '';
        setFileExcel(null);
    }

    const showImage = (item) => {
        if (item.img !== "") {
            return <img alt='' height={150} src={config.apiPath + '/uploads/' + item.img}/>
        }

        return <></>;
    }

    return <BackOffice>
        <div className="h4">Product</div>
        <button onClick={clearForm} className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus"></i>เพิ่มรายการ
        </button>

        <button onClick={clearFormExcel} className="btn btn-success" data-toggle='modal' data-target='#modalExcel'>
            <i className="fa fa-arrow-down mr-2"></i>Import from Excel
        </button>
        
        <table className="mt-3 table table-bordered table-stripped">
            <thead>
                <tr>
                    <th width='150'>ภาพสินค้า</th>
                    <th>name</th>
                    <th width='150px' className="text-right">cost</th>
                    <th width='140px' className="text-right">price</th>
                    <th width='150px' className="text-center"></th>
                </tr>
            </thead>
            <tbody>
                {(products.length > 0) ? products.map(item =>
                    <tr key={item.id}>
                        <td>{showImage(item)}</td>
                        <td>{item.name}</td>
                        <td className="text-right">{item.cost}</td>
                        <td className="text-right">{item.price}</td>
                        <td className="text-center">
                            <button className="btn btn-primary mr-2"
                                data-toggle='modal'
                                data-target='#modalProduct'
                                onClick={e => setProduct(item)}
                            >
                                <i className="fa fa-edit"></i>
                            </button>
                            <button className="btn btn-danger" onClick={e => handleRemove(item)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </td>
                    </tr>
                ) : <>no product</>}
            </tbody>
        </table>

        <MyModal id='modalProduct' title='สินค้า'>
            <div>
                <div>ชื่อสินค้า</div>
                <input value={product.name} className="form-control" onChange={e => setProduct({ ...product, name: e.target.value })}/>
            </div>
            <div>
                <div>ราคาทุน</div>
                <input value={product.cost} className="form-control" onChange={e => setProduct({ ...product, cost: e.target.value })}/>
            </div>
            <div>
                <div>ราคาขาย</div>
                <input value={product.price} className="form-control" onChange={e => setProduct({ ...product, price: e.target.value })}/>
            </div>
            <div>
                <div className="mb-3">{showImage(product)}</div>
                <div>ภาพสินค้า</div>
                <input className="form-control" type="file" ref={refImg} onChange={e => selectedFile(e.target.files)} />
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
            </div>
        </MyModal>

        <MyModal id='modalExcel' title='เลือกไฟล์'>
                <div>เลือกไฟล์</div>
                <input className="form-control" type="file" ref={refExcel} onChange={e => selectedFileExcel(e.target.files)}/>

                <button className="mt-3 btn btn-primary" onClick={handleUploadExcel}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
        </MyModal>
    </BackOffice>
}

export default Product;