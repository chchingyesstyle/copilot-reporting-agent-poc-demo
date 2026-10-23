// ALL DATA BELOW IS FICTIONAL SAMPLE DATA.
window.NODES={
aurora:{t:"Aurora PostgreSQL DM (SAMPLE name)",k:"std",o:"DM / DB team",d:"Existing data mart on Aurora PostgreSQL. Only the reader endpoint is used, with a dedicated read-only role limited to aggregate views.",c:["No direct connector from Copilot Studio / Power Platform into RDS (principle).","Reader replica load and lag must be checked before scheduling extracts.","Tier 2/3 (sensitive) data classification must be confirmed before any extract."]},
agg:{t:"Aggregated SQL views",k:"rec",o:"DM / DB team",d:"All calculations (sums, ratios, month-over-month) are done in SQL in the DW. Output is small, aggregated and contains no row-level personal data.",c:["Define a stable column contract (names, types, period keys).","Minimum aggregation threshold to avoid re-identification.","Versioned SQL kept in source control."]},
s3:{t:"S3 + Athena (or manual export)",k:"rec",o:"DM / DB team",d:"Middle layer. POC starts even simpler: a manually exported aggregated Excel/CSV placed in SharePoint. Later, a scheduled export lands in S3 and is queried via Athena; ideally output is platform-automated.",c:["Bucket encryption, least-privilege IAM, no public access.","Athena cost / scan limits for scheduled queries.","Manual export is acceptable for POC only."]},
tableau:{t:"Tableau published data source",k:"later",o:"DM / BI team",d:"Alternative middle layer: build a governed Tableau published data source on top of the aggregated SQL views, instead of (or alongside) S3+Athena. It has two ways out to the agent: (1) scheduled export via the Tableau REST API / VizQL Data Service into the SharePoint sync path – works without Tableau MCP; (2) live query through Tableau MCP later.",c:["Source must be built on the aggregated views, not raw tables.","Export path: service account / PAT for REST API or VDS, owned by BI team.","VizQL Data Service needs Tableau Server 2025.1+ (unverified for us).","Row-level security must match the intended audience."]},
sp:{t:"SharePoint / OneDrive library",k:"rec",o:"IT / Power Platform",d:"Recommended POC landing zone. Copilot Studio can use library files as knowledge, inherits SharePoint permissions, and is covered by existing M365 audit and DLP.",c:["Limit library membership to POC users.","File size / format limits for knowledge sources.","Sensitivity labels and retention to be agreed."]},
sync:{t:"Power Automate / Lambda sync",k:"rec",o:"IT / Power Platform",d:"Scheduled job copying the aggregated file from S3, or a Tableau published-source export (REST API / VDS), into the SharePoint library. Power Automate or an AWS Lambda can do it.",c:["Connector / DLP policy must allow the AWS S3 connector or HTTPS call.","Service account / managed identity ownership.","Premium connector licensing may apply."]},
api:{t:"Small API / MCP server",k:"later",o:"IT + DM team",d:"Later option: a tiny read-only API or MCP server exposing only the approved aggregate datasets as tools for the agent.",c:["Needs hosting, authN/Z and monitoring owner.","Internal network needs public HTTPS entry or a gateway.","MCP support in Copilot Studio to be verified for our tenant."]},
tmcp:{t:"Tableau MCP (tableau/tableau-mcp)",k:"later",o:"BI team + IT",d:"One of two ways out of the Tableau published source: the official Tableau MCP server lets the Copilot Studio agent query published data sources live via VizQL Data Service (VDS). The other way is a scheduled export into SharePoint, which does not need MCP.",c:["Requires Tableau Server 2025.1+ (unverified for us).","OAuth needs 2025.3+ (unverified).","Internal network needs public HTTPS entry or gateway.","OAuth compatibility with Copilot Studio unverified."]},
agent:{t:"Copilot Studio agent",k:"rec",o:"IT / Copilot Studio owner (TBD)",d:"Combines aggregated data with M365 content. The Copilot LLM integrates and writes the narrative. It does not recalculate figures that the DW has already produced.",c:["Owner not yet decided.","Copilot Studio capacity / message consumption unverified.","Written confirmation that data is not used for training is required."]},
m365:{t:"M365 content",k:"std",o:"IT / content owners",d:"Documents, notes and mail the user is already allowed to see (e.g. vendor notes, budget memos). Access is trimmed by user permissions.",c:["Only the user's own permissions apply – verify with test accounts.","Sensitivity labels / DLP must be respected in generated output."]},
ci:{t:"Code interpreter (preview)",k:"later",o:"Copilot Studio owner",d:"Optional light calculations or chart creation inside the agent when SQL is not practical.",c:["Preview feature: no SLA, may change, may be disabled by policy.","Keep heavy / authoritative calculations in the DW."]},
out:{t:"Agent flow → Word / Excel / PDF",k:"rec",o:"IT / Power Platform",d:"Agent flow assembles the final report and saves Word / Excel / PDF to SharePoint or OneDrive, where retention and audit apply.",c:["Template ownership and branding.","Review-before-publish step recommended (human in the loop)."]}
};
window.PRESETS=[
{id:"it",title:"Monthly IT expense summary",prompt:"Summarise last month's IT expenses by category against budget, highlight variances over 5%, and cross-reference the vendor notes in SharePoint.",
 table:"v_it_expense_monthly (SAMPLE)",cols:["Category","Budget (k)","Actual (k)","Variance %"],
 rows:[["Cloud hosting",120,134,11.7],["Software licences",95,92,-3.2],["Hardware",40,31,-22.5],["Support contracts",60,63,5.0],["Training",15,14,-6.7]],
 docs:[["Vendor_Notes_SAMPLE.docx","“Cloud vendor A raised unit price 8% from September (SAMPLE).”"],["Budget_Memo_SAMPLE.docx","“Hardware refresh deferred to Q1 pending approval (SAMPLE).”"]],
 dw:"Variance % and totals computed in SQL (v_it_expense_monthly)",ci:"Re-checked total: Budget 330k, Actual 334k, +1.2%",
 narr:"Total spend was 334k against a budget of 330k (+1.2%). The overrun is driven by Cloud hosting (+11.7%), which the vendor note links to an 8% unit-price increase from September. Hardware is 22.5% under budget because the refresh was deferred to Q1. Support contracts are at the 5% threshold. Recommend reviewing hosting commitments and confirming the hardware timeline."},
{id:"inc",title:"Database incident & ticket trend",prompt:"Show incident counts per severity for the last 6 months, compare with the change calendar notes, and draft a short management paragraph.",
 table:"v_incident_by_month (SAMPLE)",cols:["Month","Sev1","Sev2","Sev3"],
 rows:[["May",2,9,31],["Jun",1,8,28],["Jul",3,12,35],["Aug",1,7,26],["Sep",0,6,24],["Oct",0,5,22]],
 docs:[["Change_Calendar_SAMPLE.xlsx","“Major engine upgrade window in July (SAMPLE).”"],["Postmortem_SAMPLE.docx","“Sev1 cluster in July linked to failover config (SAMPLE).”"]],
 dw:"Counts and 3-month rolling average computed in SQL",ci:"Chart series and Sev1+2 totals verified",
 narr:"Incidents peaked in July (3 Sev1, 12 Sev2), coinciding with the engine upgrade window and a failover configuration issue noted in the postmortem. Since August, all severities have trended down and there have been no Sev1 events in September or October. Recommend keeping the post-upgrade checklist as standard practice."},
{id:"lic",title:"Licence utilisation vs. cost",prompt:"List licence products with assigned vs. active seats and monthly cost, flag under-used products, and add notes from the renewal documents.",
 table:"v_licence_usage (SAMPLE)",cols:["Product","Assigned","Active","Utilisation %"],
 rows:[["Product A",200,182,91],["Product B",120,66,55],["Product C",80,74,93],["Product D",50,19,38],["Product E",35,30,86]],
 docs:[["Renewal_Terms_SAMPLE.pdf","“Product D renews 1 Jan; 60-day notice (SAMPLE).”"],["Licence_Review_SAMPLE.docx","“Product B rollout still in progress (SAMPLE).”"]],
 dw:"Utilisation % computed in SQL from assignment and sign-in aggregates",ci:"Estimated reclaimable seats: 31 (B+D)",
 narr:"Overall utilisation is healthy for Products A, C and E (86–93%). Product D is at 38% and renews on 1 January with a 60-day notice window, so a decision is needed soon. Product B is at 55%, but the rollout is still in progress, so re-measure before acting. Roughly 31 seats could be reclaimed across B and D."}
];
window.QS=[
{g:"Questions for IT (Power Platform / Copilot Studio)",i:[
["Who will own the Copilot Studio agent, and who is the product owner for the POC?",0],
["Which licence is in use (M365 Copilot per user vs. Copilot Studio capacity / pay-as-you-go), and are POC users licensed?",1],
["Can we get a dedicated SharePoint library for aggregated files with restricted membership?",0],
["Which DLP policies apply to Copilot Studio, SharePoint knowledge and the S3 / HTTP connectors?",1],
["Is Copilot Studio capacity (messages / credits) sufficient for the POC, and what does it cost beyond that?",1],
["Is Power Automate (premium connectors) or an AWS Lambda preferred for syncing files?",0],
["Which audit and retention settings apply to agent conversations and generated reports?",0],
["Are preview features (code interpreter, MCP in Copilot Studio) allowed by tenant policy?",1]]},
{g:"Questions for the DM / DB team",i:[
["Which aggregated views / datasets are in scope for the POC, and what is the column contract?",0],
["Is the reader endpoint load acceptable for scheduled extracts? What are the lag and window constraints?",0],
["Is any Tier 2 / Tier 3 data included in the aggregates? If so, is an approval needed?",1],
["Can the S3 + Athena export be automated by the platform, or is manual export needed first?",0],
["Who owns the SQL logic and its change control?",0],
["What minimum aggregation level avoids row-level or personal data leaking into reports?",0]]},
{g:"Unverified items (do not assume)",i:[
["Licence entitlement for each POC user",1],["DLP policy compatibility",1],["Data classification: Tier 2/3 content in sources",1],
["Copilot Studio capacity and cost",1],["Tableau Server version (2025.1+ for MCP) and VizQL Data Service availability",1],
["OAuth compatibility (Tableau 2025.3+) with Copilot Studio",1],["Written confirmation from Microsoft / IT that our data is not used for model training",1],
["Preview feature status (code interpreter) and support terms",1],["Public HTTPS entry or gateway for internal Tableau / API",1]]}
];
