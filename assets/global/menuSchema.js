/*
NOTE: 
1. Add URL with backslash at starting
2. Don't add backslash at URL end
3. If the menu doesn't need any URL when rendering the screen add empty quotes("")
*/

const menuSchema = {
  dashboard: {
    template: "/assets/pages/dashboard/dashboard.html",
    url: "/",
  },
  organizationlist: {
    template: "/assets/pages/organization/organizationlist.html",
    callback: organizationList,
    url: "/organization",
  },
  addinstitute: {
    template: "/assets/pages/organization/addinstitute.html",
    callback: addInstituteToOrganization,
    url: "/addinstitute",
  },
  institutelist: {
    template: "/assets/pages/institute/institutelist.html",
    callback: instituteList,
    url: "/institute",
  },
  addcollege: {
    template: "/assets/pages/institute/addinstitutecollege.html",
    callback: addCollegeToInstitute,
    url: "/addcollege",
  },
  components_buttons: {
    template: "/assets/pages/components/button.html",
  },
};
