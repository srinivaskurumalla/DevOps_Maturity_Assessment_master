import { Component, OnInit, ApplicationRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import 'jspdf-autotable'; // Optional for table formatting
import { Router } from '@angular/router';

interface Question {
  id: number;
  title: string;
  Challenge: string;
  SomeOfTheThingsYouMightHaveSee: string | string[];
  options: string[];
  selectedOption: string; // To store the selected option for each question
}

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  cols!: Column[];

  exportColumns!: ExportColumn[];
  projectData: any;

  sideBarOpen = true
  surveyQuestions: any
  currentQuestionIndex = 0; // To track the currently displayed question

  title: string = ''
  SOTIsArray: boolean = false
  reasonsArray: string[] = []
  selectedData: Question[] = []
  constructor(private dbService: DbService) { 
  }

  ngOnInit(): void {
    this.projectData = this.dbService.projectData
    this.sideBarOpen = this.dbService.isSidebarOpen ? true : false
    // this.title = this.title1
    //this.location.reload();
    this.cols = [
      { field: 'id', header: 'Id', customExportHeader: 'Id' },
      { field: 'Challenge', header: 'Challenge', customExportHeader: 'Challenge' },
      { field: 'SomeOfTheThingsYouMightHaveSee', header: 'SomeOfTheThingsYouMightHaveSee', customExportHeader: 'SomeOfTheThingsYouMightHaveSee' },
      { field: 'selectedOption', header: 'Selected Option', customExportHeader: 'Selected Option' },

    ];
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

  }

  submit(table: Question[]) {
    console.log('selected options', table);
    this.selectedData = table
    console.log('selected data', this.selectedData);

    this.dbService.showSuccess('Update Successful')
    this.exportPdf()
  }

  nextQuestion() {
    this.reasonsArray = []
    if (this.currentQuestionIndex < this.table.length - 1) {
      this.currentQuestionIndex++;

      const arr = this.table[this.currentQuestionIndex].SomeOfTheThingsYouMightHaveSee;
      if (Array.isArray(arr)) {
        this.SOTIsArray = true

        arr.forEach((element: string) => {
          this.reasonsArray.push(element)
        });
      }
      else {
        this.SOTIsArray = false
      }

    }
  }

  previousQuestion() {
    this.reasonsArray = []
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;


      const arr = this.table[this.currentQuestionIndex].SomeOfTheThingsYouMightHaveSee;
      if (Array.isArray(arr)) {
        this.SOTIsArray = true

        arr.forEach((element: string) => {
          this.reasonsArray.push(element)
        });
      }
      else {
        this.SOTIsArray = false
      }
    }
  }

  table: Question[] = [
    {
      id: 1,
      title: 'Inter-Team Collaboration & Communication',
      Challenge: 'Each functional group has its own way of assessing the success or failure of work (rather than using common, cross-group measures/standards)',
      SomeOfTheThingsYouMightHaveSee: 'Functional groups (like Development, Operations, Testers, Product Managers, Release Coordinators) may work together during the delivery of software, but they measure success of the work using different criteria.    Different areas of the organization disagree on the overall success/failure of a given delivery.    Parts of the organization believe projects are successful if they deliver exactly what was asked for, on time and on budget (even if the end users are unhappy with the system or it doesnt get used). ',
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 2,
      title: 'Inter-Team Collaboration & Communication',
      Challenge: 'Reporting structure and/or team topology gets in the way of effective collaboration and communication ',
      SomeOfTheThingsYouMightHaveSee: `Reporting hierarchies or cross-functional rivalries make effective collaboration and communication difficult or impossible.
      There is a "them and us" mentality among functional groups.
      Functional managers don't buy in to the "collaboration and communication" approach and undermine its effectiveness.
      Territorial sensitivities between functional groups make open, honest, and effective collaboration and communication impossible.
      Once the system is deployed to production, the cross-functional team is disbanded, and each resource goes back to their "normal" reporting hierarchy.
      `,
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 3,
      title: 'Inter-Team Collaboration & Communication',
      Challenge: 'Lack of effective tooling to facilitate cross-functional collaboration',
      SomeOfTheThingsYouMightHaveSee: `
      The ability of teams/functions to collaborate effectively is undermined because of a lack of good collaboration tools or poor practices around their use, including:
      - No collaboration tooling exists in the organization.
      - Collaboration tools exist but no one uses them.
      - Tools exist but access rights are restricted.
      - Not all tooling features are available to all teams/functions.
      - Different teams/functions use different tools.
      `.trim().split('\n'),

      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 4,
      title: 'Inter-Team Collaboration & Communication',
      Challenge: 'When vendors are responsible for parts of delivery, establishing effective collaboration with them is challenging',
      SomeOfTheThingsYouMightHaveSee: `
      Contract terms make effective collaboration difficult (e.g. fixed scope agreements, terms and conditions that discourage openness and collaboration, unrealistic requirements or expectations, adversarial bias in contract wording, penalty clauses, vendor or organizational processes that stifle collaboration, change is discouraged by a formal change request process).
      A "them and us" attitude exists between customer and vendor.
      There is a lack of trust between parties (often with good reason).      
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 5,
      title: 'Cross-Functional Knowledge',
      Challenge: `Functional teams lack knowledge and understanding of each other's practices/needs`,
      SomeOfTheThingsYouMightHaveSee: `
      Functional groups (like BAs, Developers, Testers, Operations team) lack knowledge and understanding of other functional groups, how they operate, and what they need to be successful.
      This lack of knowledge/understanding often leads to mis-steps, inefficiencies, and rework on project deliverables.
      There is a good deal of "finger pointing" between functional groups when things go wrong.
      Functional groups "don't understand one another" and have trouble working together effectively.
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 6,
      title: 'Cross-Functional Knowledge',

      Challenge: `Functional teams lack knowledge and understanding about each other's roles and responsibilities`,
      SomeOfTheThingsYouMightHaveSee: `
      Functional groups have difficulty working together effectively because it is unclear who is responsible for what on project deliverables.
      Roles and responsibilities are either poorly defined or don't exist.
      There are frequent missteps that happen during delivery projects because it is unclear who is responsible for what on the project.
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 7,
      title: 'Organizational Culture',
      Challenge: `There is a fear of change or fear of being displaced/replaced if the required cultural and behavioral changes take place`,
      SomeOfTheThingsYouMightHaveSee: `
      Discussions about change often raise fears about how it may add to/take away/diminish people's job responsibilities (concerns around job loss, downgrading of roles, loss of  authority, etc.). 
      Previous organizational change initiatives have not gone well.
      The need for change is met with skepticism, resistance, or ambivalence.
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 8,
      title: 'Organizational Culture',
      Challenge: `Functional groups don't understand or prioritize each other's needs`,
      SomeOfTheThingsYouMightHaveSee: `
      It's hard to convince people to engage in functional cross-training. 
      A "them vs. us" or "it's not my job" mentality prevails for many team members.
      Many people avoid making time to understand how they can collaborate better or transition work effectively between functional areas.
      Misunderstandings are common between delivery team members who represent different functional groups.
      Little or no effort is made to inform/teach/train delivery team members on the particular needs and challenges faced by different functional groups.
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 9,
      title: 'Tooling',
      Challenge: `Organization doesn't follow good practices around tooling`,
      SomeOfTheThingsYouMightHaveSee: `
      Too many tools in use within or across teams.
      Lack of integration between tools across and within teams.
      Many teams use different technology and tool stacks for achieving the same end goal. 
      Tooling is used only sporadically within the organization.
      Efforts to get effective tooling practices established have never really gotten off the ground.
      Differences in the way tooling is used across the organization limits its usefulness.
            `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 10,
      title: 'Tooling',

      Challenge: `Poor tool selection and/or configuration`,
      SomeOfTheThingsYouMightHaveSee: `
      Tooling is selected based on features without understanding which features are really needed by the organization or how the tool will actually be used.
      Tooling is selected without considering the cross-functional nature of DevOps and how tooling helps to enable effective DevOps practices. 
      Tooling is configured or used in a way which undermines effectiveness (e.g. too complex or difficult to use, doesn't track the right information, won't integrate with other tools used elsewhere in organization, is being used in a way which the tool was never meant to work).
      Existing tooling (which is known to be ineffective) is not improved or replaced.
      Tool selection is done by each functional group individually and doesn't consider impact on other functional groups.
       `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 11,
      title: 'Tooling',

      Challenge: `Tool complexity and integration challenges`,
      SomeOfTheThingsYouMightHaveSee: `
      Too many "single purpose" tools are used even when better-rounded options are available (leading to the need for more tooling integration effort and less capable tooling overall).
      Tooling integrations don't work well, compromising overall effectiveness.
      Dedicated (or near dedicated) resources need to be assigned to deal with tooling related integration or configuration, because it needs constant attention.
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 12,
      title: 'Organizational Processes',
      Challenge: `Organization's governance and delivery processes are heavy and include many redundant and non-value-add steps
      `,
      SomeOfTheThingsYouMightHaveSee: `
      Delivery and governance processes are designed using outdated approaches that don't accommodate the needs of Agile/DevOps delivery approaches.
      Delivery teams are forced to create documents or other deliverables which either don't make sense (e.g. detailed project plans, formal requirements documents, elaborate change management or risk mitigation artifacts) or forces them to work in ways that are counter to Agile/DevOps.
      Delivery teams complain about doing work that doesn't make sense or needlessly delay delivery to satisfy outdated processes.
      Delivery teams complain about the level of redundant or low-value-added tasks they are required to complete.
      Artifacts/documents created to comply with organization process requirements are rarely used once they have been approved.
            `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 13, title: 'Organizational Processes',

      Challenge: `New or changing requirements create havoc for your delivery teams`,
      SomeOfTheThingsYouMightHaveSee: `
      Delivery teams does not have effective mechanisms (fluid product backlogs, effective lightweight estimation practices, flexible work plans that accommodate change, effective prioritization techniques, etc.)  that allow changing requirements to be dealt with as a normal part of delivery, rather than chaos-inducing events.
      `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 14, title: 'Organizational Processes',

      Challenge: `Poor or inappropriate metrics/measurements used by organization
      `,
      SomeOfTheThingsYouMightHaveSee: `
      Teams lack relevant and effective metrics (for things like throughput, quality, and overall customer satisfaction), which would be beneficial in speeding delivery time and maximizing value to stakeholders. 
      Delivery teams don't know their areas of weakness or if improvements they make to processes have a beneficial impact.
       `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },
    {
      id: 15, title: 'Organizational Processes',

      Challenge: `Transition of work between functional groups is slow, inefficient, and error-prone`,
      SomeOfTheThingsYouMightHaveSee: `
      Functional groups are still siloed in their approach to work and use heavy and ineffective formal hand-offs rather than a transition of primary responsibility between functions (e.g. emails with multiple versions).
      Artifacts passed from one functional group to the next are often not immediately useful to the recipient and require additional work or are ignored.
      Transitions are done manually, with little or no use of automation, leading to increased risk of human error.
       `.trim().split('\n'),
      options: ['Rarely', 'Always', 'Often', 'Sometimes', 'Never'], selectedOption: ''
    },

  ];

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        var doc = new jsPDF.default('p', 'px', 'a4');
        // Add header
        const headerText = `${this.projectData.buName}`;
        const headerHeight = 30; // Increased header height
        const headerColor = [0, 0, 255]; // Blue color for header
        doc.setFontSize(16);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]); // Set header text color

        // doc.setTextColor(...headerColor); // Set header text color
        doc.text(headerText, doc.internal.pageSize.getWidth() / 2, headerHeight, { align: 'center' });

        // Main header text with larger font and blue color
        doc.setFontSize(16);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.text(headerText, doc.internal.pageSize.getWidth() / 2, headerHeight, { align: 'center' });

        // Sub-header text with smaller font and black color
        const subHeaderText = `${this.projectData.projectName}`; // Assuming sub-header content
        const subHeaderFontSize = 12;
        doc.setFontSize(subHeaderFontSize);
        doc.setTextColor(0, 0, 0); // Black color for sub-header
        const subHeaderTextY = headerHeight + subHeaderFontSize + 5; // Adjust vertical spacing

        // Get sub-header text width
        const subHeaderTextWidth = doc.getTextWidth(subHeaderText); // Measure text width

        // Calculate decoration line coordinates
        const startX = (doc.internal.pageSize.getWidth() - subHeaderTextWidth) / 2; // Centered alignment
        const startY = subHeaderTextY + 2; // Adjust spacing between sub-header and line
        const endX = startX + subHeaderTextWidth;
        const lineHeight = 1; // Line thickness

        // Draw the decoration line
        doc.setLineWidth(lineHeight);
        doc.setDrawColor(headerColor[0], headerColor[1], 0); // Same color as header
        doc.line(startX, startY, endX, startY);

        doc.text(subHeaderText, doc.internal.pageSize.getWidth() / 2, subHeaderTextY, { align: 'center' });


        const headerY = subHeaderTextY + 30; // Y position below the header

        // Add margin line
        const marginLineY = headerY + 10; // Adjust the Y position as needed
        const marginLineXStart = 10;
        const marginLineXEnd = doc.internal.pageSize.getWidth() - 10;
        doc.setLineWidth(0.5); // Set line width
        doc.setDrawColor(0); // Set line color to black
        doc.line(marginLineXStart, marginLineY, marginLineXEnd, marginLineY); // Draw line

        const contentWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(11);

        // Calculate the width of each text element
        const dateWidth = doc.getStringUnitWidth(Date.now().toString()) * 3;

        // Calculate the starting X position for each text element
        // const maturityLevelX = (contentWidth - maturityLevelWidth) / 2; // Center aligned
        const dateX = contentWidth - dateWidth - 10; // Right aligned
        doc.setTextColor(headerColor[0], headerColor[1], 0); // Set header text color

        doc.text(`Date : ${new Date().toLocaleDateString()}`, dateX, headerY, { align: 'right' });

        // Set styles for the table
        const defaultStyles = {
          font: 'Arial',
          fontSize: 12,
          fontStyle: 'normal',
          textColor: [0, 0, 0], // black text color
          overflow: 'linebreak', // overflow method
          cellPadding: 5, // cell padding (space between content and cell border)
          valign: 'middle', // vertical alignment
          halign: 'left', // horizontal alignment
          fillColor: [255, 255, 255], // background color for the table cells
          lineWidth: 0.1, // width of table borders
          lineColor: [0, 0, 0] // color of table borders (black)
        };

        // Override alignment for "Score" column to be centered
        const scoreColumnStyle = { ...defaultStyles, halign: 'center' };

        // Set styles for the header row
        const headerStyles = {
          fillColor: [200, 200, 200], // background color for the header row
          textColor: [0, 0, 0], // black text color for header row
          fontStyle: 'bold', // bold font style for header row
        };

        // Mapping over the data array to exclude the 'id' field
        const body = this.selectedData.map(({ id, Challenge, SomeOfTheThingsYouMightHaveSee, selectedOption }) => Object.values({ id, Challenge, SomeOfTheThingsYouMightHaveSee, selectedOption }));

        (doc as any).autoTable({
          head: [this.exportColumns], // Header row
          body: body, // Table data
          startY: marginLineY + 5, // Y position to start the table (below the margin line)
          styles: defaultStyles,
          columnStyles: {
            4: scoreColumnStyle,
          }, // Table styles
          headStyles: headerStyles, // Header row styles
          // addPageContent: addFooter // Add footer with page numbers
        });

        doc.save('Challenges.pdf'); // Save the PDF
      });
    });
  }
}
