import "../assests/css/footer.css";
import { FaMapMarkerAlt, FaPhoneVolume, FaEnvelope } from "react-icons/fa";
import fb from "../assests/img/facebook.png";
import wtsup from "../assests/img/whatsapp.png";
import twiter from "../assests/img/twitter.png";
import insta from "../assests/img/instagram.avif";

function Footer() {
  return (
    <div className="footer">
      <div className="sbFooter sectionPadding">
        <div className="sbFooterLinks">
          <div className="sbFooterLinksDiv">
            <h4>Cyber Guardian</h4>
            <a href="/">
              <p>Nurturing Trust in Every Byte</p>
            </a>
            <a href="/">
              <p>Pioneering Digital Defense Solutions</p>
            </a>
            <a href="/">
              <p>Safeguarding Your Digital Footprint</p>
            </a>
          </div>

          <div className="sbFooterLinksDiv">
            <h4>Contact Us</h4>
            <a href="/">
              <p>
                <FaMapMarkerAlt style={{ marginRight: "5px" }} />
                London
              </p>
            </a>
            <a href="/">
              <p>
                <FaPhoneVolume style={{ marginRight: "5px" }} />
                +1 323-789-4562
              </p>
            </a>
            <a href="/">
              <p>
                <FaEnvelope style={{ marginRight: "5px" }} />
                xyz@gmail.com
              </p>
            </a>
          </div>

          {/* <div className="sbFooterLinksDiv">
            <h4>Partners</h4>
            <a href="/resource">
              <p>Swing Tech</p>
            </a>
          </div> */}

          <div className="sbFooterLinksDiv">
            <h4>Company</h4>
            <a href="/">
              <p>Home</p>
            </a>
            <a href="/">
              <p>About</p>
            </a>
            <a href="/">
              <p>Contact</p>
            </a>
          </div>

          <div className="sbFooterLinksDiv">
            <h4>Coming Soon!!</h4>
            <div className="socialMedia">
              <p>
                <img alt="" src={fb} />
              </p>
              <p>
                <img alt="" src={wtsup} />
              </p>
              <p>
                <img alt="" src={twiter} />
              </p>
              <p>
                <img alt="" src={insta} />
              </p>
            </div>
          </div>
        </div>

        <hr />
        <div className="sbFooterBelow">
          <div className="sbFooterCopyright">
            <p>@{new Date().getFullYear()} All Right Reserved</p>
          </div>
          <div className="sbFooterBelowLinks">
            <a href="/terms">
              <div>
                <p>Terms & Conditions</p>
              </div>
            </a>
            <a href="/privacy">
              <div>
                <p>Privacy</p>
              </div>
            </a>
            <a href="/security">
              <div>
                <p>Security</p>
              </div>
            </a>
            <a href="/cookie">
              <div>
                <p>Cookie Declaration</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Footer;
