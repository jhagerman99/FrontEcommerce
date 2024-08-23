import { useEffect, useState } from "react";
import BackOffice from "../../components/BackOffice";
import Swal from "sweetalert2";
import config from "../../config";
import axios from "axios";
import dayjs from 'dayjs';
import MyModal from "../../components/MyModal";

function BillSale() {
    const [billSales, setBillSales] = useState([]);
    const [billSaleDetails, setBillSaleDetails] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/sale/list', config.headers());

            if (res.data.results !== undefined) {
                setBillSales(res.data.results);
            } 

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const openModalInfo = async (item) =>{
        try {
            const res = await axios.get(config.apiPath + '/api/sale/billInfo/' + item.id, config.headers());

            if (res.data.results !== undefined) {
                setBillSaleDetails(res.data.results);

                let mySumPrice = 0;

                for (let i = 0; i < res.data.results.length; i++) {
                    mySumPrice += parseInt(res.data.results[i].price)
                }

                setSumPrice(mySumPrice);
            }

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handlePay = async(item) => {
        try {
            const button = await await Swal.fire({
                title: 'ยืนยันการชำระเงิน',
                text: 'คุณได้รับการชำระเงิน และตรวจสอบข้อมูลแล้ว',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToPay/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'save',
                        text: 'บันทึกข้อมูลแล้ว',
                        icon: 'success',
                        timer: 1000
                    })
                }

                fetchData();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleSend = async(item) => {
        try {
            const button = await await Swal.fire({
                title: 'ยืนยันการจัดส่ง',
                text: 'คุณได้ทำการจัดส่ง และตรวจสอบข้อมูลแล้ว',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToSend/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'save',
                        text: 'บันทึกข้อมูลแล้ว',
                        icon: 'success',
                        timer: 1000
                    })
                }

                fetchData();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleCancel = async(item) => {
        try {
            const button = await await Swal.fire({
                title: 'ยืนยันการยกเลิก',
                text: 'คุณตรวจสอบข้อมูลแล้ว และต้องการทำการยกเลิก',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToCancel/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'save',
                        text: 'บันทึกข้อมูลแล้ว',
                        icon: 'success',
                        timer: 1000
                    })
                }

                fetchData();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const displayStatusText = (item) => {
        if (item.status === 'wait') {
            return <div className="badge bg-dark">รอตรวจสอบ</div>
        } else if (item.status === 'pay') {
            return <div className="badge bg-success">ชำระแล้ว</div>
        } else if (item.status === 'send') {
            return <div className="badge bg-info">จัดส่งแล้ว</div>
        } else if (item.status === 'cancel') {
            return <div className="badge bg-danger">ยกเลิกรายการ</div>
        }
        console.log(item.status);
    }

    return <BackOffice>
        <div className="card">
            <div className="card-header">
                <div className="card-title">รายงานยอดขาย</div>
            </div>
            <div className="card-body">
                <table className="table table-bordered table-striped">
                    <thead>
                        <th>ลูกค้า</th>
                        <th>เบอร์โทร</th>
                        <th>ที่อยู่</th>
                        <th>วันที่ชำระเงิน</th>
                        <th>เวลา</th>
                        <th>สถานะ</th>
                        <th width='500px'></th>
                    </thead>
                    <tbody>
                        {billSales.length > 0 ? billSales.map(item => 
                            <tr key={item.id}>
                                <td>{item.customerName}</td>
                                <td>{item.customerPhone}</td>
                                <td>{item.customerAddress}</td>
                                <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                                <td>{item.payTime}</td>
                                <td>{displayStatusText(item)}</td>
                                <td className="text-center">
                                    <button className="btn btn-secondary mr-1"
                                        data-toggle='modal'
                                        data-target='#modalInfo'
                                        onClick={e => openModalInfo(item)}>
                                        <i className="fa fa-file mr-2"></i>รายการ
                                    </button>
                                    <button className="btn btn-info mr-1"
                                        onClick={e => handlePay(item)}>
                                        <i className="fa fa-check mr-2"></i>ได้รับชำระเงินแล้ว
                                    </button>
                                    <button className="btn btn-success mr-1"
                                        onClick={e => handleSend(item)}>
                                        <i className="fa fa-file mr-2"></i>จัดส่งแล้ว
                                    </button>
                                    <button className="btn btn-danger"
                                        onClick={e => handleCancel(item)}>
                                        <i className="fa fa-times mr-2"></i>ยกเลิก
                                    </button>
                                </td>
                            </tr>
                        ):<></>}
                    </tbody>
                </table>
            </div>
        </div>

        <MyModal id='modalInfo' title='รายการของบิล'>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>รายการ</th>
                        <th className="text-right">ราคา</th>
                        <th className="text-right">จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                    {billSaleDetails.length > 0 ? billSaleDetails.map(item => 
                        <tr key={item.id}>
                            <th>{item.Product.name}</th>
                            <th className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</th>
                            <th className="text-right">1</th>
                        </tr>
                    ):<></>}
                </tbody>
            </table>

            <div className="text-center mt-3">
                ยอดรวม {sumPrice.toLocaleString('th-TH')} บาท
            </div>
        </MyModal>
    </BackOffice>
}

export default BillSale;