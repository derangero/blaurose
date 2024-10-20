

import { MDBNavbarLink } from "mdb-react-ui-kit";

const SubPageFooter = () => {
    return (
      <div className="d-grid gap-2 col-2 mx-auto my-3">
        <MDBNavbarLink active aria-current='page' href='/main/main' className="btn btn-primary" type="button"  data-mdb-ripple-init>
            戻る
        </MDBNavbarLink>
      </div>
   );
};
export default SubPageFooter;
//<button className="btn btn-primary" type="button" data-mdb-ripple-init></button>