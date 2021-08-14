import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CopyButton from "./CopyButton";

import {
  convertToValidLongUrl,
  isValidLongUrl,
  getUnusedShortUrl,
  getLoggedinUser,
} from "./UrlformHelper";
import config from "../../shared/config";
import { postShortUrl } from "../../shared/requests";

const validationSchema = yup.object({
  longUrl: yup
    .string("")
    .required("Your URL is required")
    .test("URL validation", "Invalid URL", (value) => {
      const inputValue = value === undefined ? "" : value;
      const converted = convertToValidLongUrl(inputValue);
      const isValid = isValidLongUrl(converted);
      return isValid;
    }),
  shortUrl: yup
    .string("")
    .matches(/^[a-zA-Z0-9-]{3,}$/, "Only numbers, letters, and -")
    .min(3, "At least 3 chars"),
});

const Urlform = () => {
  const formik = useFormik({
    initialValues: {
      longUrl: "",
      shortUrl: "",
      baseUrl: window.location.origin.split("://")[1] + "/",
      confirmedShortUrl: "",
      submitted: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      const { longUrl, shortUrl } = values;
      let finalShortUrl;
      if (shortUrl === "") {
        finalShortUrl = await getUnusedShortUrl();
      } else {
        finalShortUrl = shortUrl;
      }

      const userid = getLoggedinUser();
      console.log(`userid: ${userid}`);
      const response = await postShortUrl(longUrl, finalShortUrl, userid);

      if ("error" in response) {
        formik.errors.status = response.error;
        formik.values.shortUrl = "";
        formik.values.submitted = false;
      } else if (config.SHORT_URL_KEY in response) {
        formik.values.confirmedShortUrl =
          window.location.origin + "/" + response[config.SHORT_URL_KEY];
        formik.errors.status = "";
        formik.values.submitted = true;
      }

      actions.setSubmitting(false);
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box mb={2}>
          <TextField
            disabled={formik.values.submitted}
            fullWidth
            id="longUrl"
            name="longUrl"
            label="Long URL"
            value={formik.values.longUrl}
            onChange={formik.handleChange}
            error={formik.touched.longUrl && Boolean(formik.errors.longUrl)}
            helperText={formik.touched.longUrl && formik.errors.longUrl}
          />
        </Box>
        <Box>
          <TextField
            disabled
            fullWidth={formik.values.submitted}
            id="baseUrl"
            name="baseUrl"
            label="Short URL"
            value={
              formik.values.submitted
                ? formik.values.confirmedShortUrl
                : formik.values.baseUrl
            }
          />

          {formik.values.submitted ? (
            ""
          ) : (
            <TextField
              fullWidth={formik.values.submitted}
              id="shortUrl"
              name="shortUrl"
              label="alias (optional)"
              value={formik.values.shortUrl}
              onChange={formik.handleChange}
              error={formik.touched.shortUrl && Boolean(formik.errors.shortUrl)}
              helperText={formik.touched.shortUrl && formik.errors.shortUrl}
            />
          )}
        </Box>

        <Box>
          <TextField
            disabled
            fullWidth
            InputProps={{ disableUnderline: true }}
            value={formik.errors.status}
          />
        </Box>

        <Grid>
          {formik.values.submitted ? (
            <CopyButton
              fullWidth
              copyValue={formik.values.confirmedShortUrl}
              size="large"
            />
          ) : (
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default Urlform;
