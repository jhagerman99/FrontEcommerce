import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { Link, useNavigate } from "react-router-dom"

function Sidebar() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const res = await axios.get(config.apiPath + '/user/info', config.headers());

        if (res.data.result !== undefined) {
          setUser(res.data.result);
        }
      } catch (e) {
        Swal.fire({
          title: 'error',
          text: e.message,
          icon: 'error'
        })
      }
    }

    const handleSignOut = async () => {
      try {
          const button = await Swal.fire({
            title: 'ออกจากระบบ',
            text: 'ยืนยันการออกจากระบบ',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
          })
          if(button.isConfirmed){
            localStorage.removeItem('token');
            navigate('/');
          }
      } catch (e) {
        Swal.fire({
          title: 'error',
          text: e.message,
          icon: 'error'
        })
      }
    }


    return (
    <>
          <aside className="main-sidebar sidebar-dark-primary elevation-4">
    <Link to="index3.html" className="brand-link">
      <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: .8 }}/>
      <span className="brand-text font-weight-light">AdminLTE 3</span>
    </Link>

    <div className="sidebar">
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="image">
          {/* eslint-disable-next-line*/}
          <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
        </div>
        <div className="info">
          <Link to="#" className="d-block">{user.name}</Link>
          <button onClick={handleSignOut} className="btn btn-danger">
            <i className="fa fa-times mr-2"></i>Sign Out
          </button>
        </div>
      </div>

      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li className="nav-header">Menu</li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <i className="nav-icon fas fa-columns"></i>
              <p>
                DashBoard
              </p>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/product" className="nav-link">
              <i className="nav-icon fa fa-box"></i>
              <p>
                สินค้า
                <span className="badge badge-info right">2</span>
              </p>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/billSale" className="nav-link">
              <i className="nav-icon far fa-image"></i>
              <p>
                รายงานยอดขาย
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
    </>
    )
}

export default Sidebar;