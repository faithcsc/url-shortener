import React from "react";
import Urlform from "../../components/Main/Urlform";

function Content() {
  return (
    <div>
      <div className="container content">
        <div className="row">
          <div className="col-sm-5 talk">
            <h1>Short links, big results</h1>
            <br />
            <h6 className="bold-four">
              A URL shortener built with powerful tools to help you grow and
              protect your brand.
            </h6>
            <br />
            <h6>
              <Urlform />
            </h6>
          </div>
          <div className="col-sm-7 showcase-img">
            {/* <div className="circle"></div> */}
          </div>
        </div>
      </div>

      <section class="features-icons bg-light text-center det-ails">
        <div class="container">
          <div class="row">
            <div class="col-lg-4">
              <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                <div class="features-icons-icon d-flex  icon-bra-ails">
                  <i class="icon-emotsmile m-auto text-primary icon-ails"></i>
                </div>
                <h5>Custom Links</h5>
                <p class="lead mb-0">
                  Create custom links that increase brand awareness and
                  engagement.
                </p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                <div class="features-icons-icon d-flex  icon-bra-ails">
                  <i class="icon-graph m-auto text-primary icon-ails"></i>
                </div>
                <h5>Link analytics</h5>
                <p class="lead mb-0">
                  Get insights into your links' performance with click tracking.
                </p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="features-icons-item mx-auto mb-0 mb-lg-3">
                <div class="features-icons-icon d-flex  icon-bra-ails">
                  <i class="icon-link m-auto text-primary icon-ails"></i>
                </div>
                <h5>Link management</h5>
                <p class="lead mb-0">
                  Easily manage your links -- all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Content;
