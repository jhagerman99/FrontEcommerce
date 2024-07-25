import Swal from "sweetalert2";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import { useEffect, useState } from "react";
import config from "../../config";
import axios from "axios";

function Product () {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            product.img = "";
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            const res = await axios.post(config.apiPath + '/product/create', product, config.headers());

            if(res.data.message === 'success') {
                Swal.fire({
                    title: 'Save',
                    text: 'success',
                    icon: 'success',
                    timer: 1000 //millisec
                });
                document.getElementById('modalProduct_btnClose').click();
                fetchData();
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

            if(res.data.result !== undefined){
                setProduct(res.data.result);
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
    }
    return <BackOffice>
        <div className="h4">Product</div>
        <button onClick={clearForm} className="btn btn-primary" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus"></i>เพิ่มรายการ
        </button>
        
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
                <div>ภาพสินค้า</div>
                <input className="form-control" type="file"/>
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
            </div>
        </MyModal>
    </BackOffice>
}

export default Product;