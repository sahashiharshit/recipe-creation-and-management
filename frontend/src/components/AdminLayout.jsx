import PropTypes from "prop-types";
const AdminLayout = ({children})=>{

return (
<div className="admin-container">
      {children} {/* No Navbar here */}
    </div>

);
};
AdminLayout.propTypes= {
children:PropTypes.node.isRequired
  
};
export default AdminLayout;