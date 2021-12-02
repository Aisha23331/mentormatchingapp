class Report {
    constructor(ReporterEmail, ReporteeEmail, Reason) {
        this.reporterEmail = ReporterEmail;
        this.reporteeEmail = ReporteeEmail;
        this.reason = Reason;
    }
}

module.exports = Report;