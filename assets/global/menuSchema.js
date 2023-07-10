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
  createprogram: {
    template: "/assets/pages/program/createprogram.html",
    callback: createprogram,
    url: "/createprogram",
  },
  components_buttons: {
    template: "/assets/pages/components/button.html",
  },
  programlist: {
    template: "/assets/pages/program/programorganizationlist.html",
    //callback: programCallbacks,
    url: "/program",
  },
  programacademiclist: {
    template: "/assets/pages/program/program_accademic.html",
    // callback: academic_Callbacks,
    url: "/program/academicyear",
  },
  programsectionlist: {
    template: "/assets/pages/program/program_section.html",
    //callback: batch_Callbacks,
    url: "/program/section",
  },

  programsectionview: {
    template: "/assets/pages/program/program_view.html",
    url: "/program/program_view",
  },

  courseslist: {
    template: "/assets/pages/courses/courses.html",
    // callback: organizationList,
    url: "/courses",
  },
};
