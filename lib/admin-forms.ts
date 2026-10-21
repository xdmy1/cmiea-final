import type { CheerioAPI } from "cheerio";

// Keep the field IDs, names and form listeners used by the existing admin.
// Only presentation and grouping change; writes still go through admin.js.
export function prepareAdminForms($: CheerioAPI) {
  function section(title: string, description: string, fields: string[]) {
    const group = $(
      '<fieldset class="admin-form-section"><legend></legend><p class="admin-form-help"></p><div class="admin-form-grid"></div></fieldset>',
    );
    group.find("legend").text(title);
    group.find(".admin-form-help").text(description);
    for (const id of fields) {
      const input = $("#" + id);
      if (!input.length) continue;
      let field;
      if (
        input.is("select") ||
        input.attr("type") === "hidden" ||
        /clubImage[234]/.test(id)
      ) {
        // The old course editor kept duplicate radio/select values and hid
        // useful settings. One visible control now owns each saved value.
        const label =
          id === "courseImage"
            ? "URL imagine"
            : id === "coursePeriod"
              ? "Perioadă"
              : id === "courseSeats"
                ? "Număr de locuri"
                : id === "courseCategory"
                  ? "Nivel"
                  : id === "courseDuration"
                    ? "Durată"
                    : id === "courseLanguage"
                      ? "Limbă"
                      : /clubImage[234]/.test(id)
                        ? `Fotografie galerie ${Number(id.slice(-1)) - 1}`
                        : input.parent().find("label").first().text();
        input.remove().removeClass("hidden");
        if (input.attr("type") === "hidden")
          input.attr(
            "type",
            id === "courseSeats"
              ? "number"
              : id === "courseImage"
                ? "url"
                : "text",
          );
        field = $('<div class="admin-field"><label></label></div>');
        field.find("label").attr("for", id).text(label);
        field.append(input);
      } else {
        field = input.parent().remove().attr("class", "admin-field");
      }
      if (input.is("textarea") || /Name|Title|Image|Period/.test(id))
        field.addClass("admin-field-wide");
      group.find(".admin-form-grid").append(field);
    }
    return group;
  }
  const editors = [
    {
      modal: "courseModal",
      form: "courseForm",
      title: "modalTitle",
      close: "closeModalBtn",
      cancel: "cancelBtn",
      save: "saveBtn",
      idField: "idField",
      description:
        "Completează informațiile cursului, programul și competențele pe care le vor dobândi participanții.",
      groups: [
        [
          "Prezentare",
          "Informațiile afișate pe site.",
          ["courseName", "courseDescription", "courseImage"],
        ],
        [
          "Organizare",
          "Nivelul, durata și locurile disponibile.",
          [
            "courseCategory",
            "courseDuration",
            "courseLanguage",
            "courseHours",
            "coursePeriod",
            "courseSeats",
          ],
        ],
        [
          "Ce vor învăța participanții",
          "Trei competențe, fiecare cu un titlu și o scurtă descriere.",
          [
            "courseLearn1Title",
            "courseLearn1",
            "courseLearn2Title",
            "courseLearn2",
            "courseLearn3Title",
            "courseLearn3",
          ],
        ],
      ],
    },
    {
      modal: "eventModal",
      form: "eventForm",
      title: "eventModalTitle",
      close: "closeEventModalBtn",
      cancel: "cancelEventBtn",
      save: "saveEventBtn",
      idField: "eventIdField",
      description:
        "Prezintă evenimentul și completează programul și condițiile de participare.",
      groups: [
        [
          "Despre eveniment",
          "Titlul și descrierea vor apărea în lista de evenimente.",
          [
            "eventTitle",
            "eventDescription",
            "eventCategory",
            "eventFacilitator",
          ],
        ],
        [
          "Program și participare",
          "Alege datele și numărul de locuri.",
          [
            "eventStartDate",
            "eventEndDate",
            "eventAvailableSpots",
            "eventRequirements",
          ],
        ],
        [
          "Informații suplimentare",
          "Adaugă afișul și notele pentru participanți.",
          ["eventImage", "eventNotes"],
        ],
      ],
    },
    {
      modal: "clubModal",
      form: "clubForm",
      title: "clubModalTitle",
      close: "closeClubModalBtn",
      cancel: "cancelClubBtn",
      save: "saveClubBtn",
      idField: "clubIdField",
      description:
        "Publică un club al comunității și actualizează programul, descrierea și imaginile lui.",
      groups: [
        [
          "Despre club",
          "Numele, descrierea și programul întâlnirilor.",
          ["clubName", "clubDescription", "clubSchedule"],
        ],
        [
          "Imagini",
          "Folosește linkuri directe către fotografii. Galeria este opțională.",
          ["clubImage", "clubImage2", "clubImage3", "clubImage4"],
        ],
      ],
    },
  ];
  for (const editor of editors) {
    const modal = $("#" + editor.modal);
    const form = $("#" + editor.form).attr("class", "admin-editor-form");
    const idField = $("#" + editor.idField, form)
      .remove()
      .addClass("admin-record-id");
    const emoji = $("#courseEmoji", form).remove();
    const schedule =
      editor.form === "courseForm"
        ? form
            .find('input[name="zileSaptamana[0]"]')
            .parent()
            .parent()
            .remove()
            .addClass("admin-schedule-grid")
        : null;
    const groups = editor.groups.map(([title, description, fields]) =>
      section(title as string, description as string, fields as string[]),
    );
    const title = $("#" + editor.title).remove();
    const close = $("#" + editor.close)
      .remove()
      .attr({ type: "button", "aria-label": "Închide formularul" });
    const cancel = form
      .find("#" + editor.cancel)
      .remove()
      .attr("class", "admin-button-secondary");
    const save = form
      .find("#" + editor.save)
      .remove()
      .attr("class", "admin-button-primary");
    form.remove();
    form.empty().append(idField, emoji);
    groups.forEach((group, index) => {
      form.append(group);
      if (index === 1 && schedule?.length) {
        const scheduleSection = $(
          '<fieldset class="admin-form-section"><legend>Orar săptămânal</legend><p class="admin-form-help">Lasă liberă ziua în care nu sunt lecții.</p></fieldset>',
        );
        schedule.find("input").each((i, element) => {
          const input = $(element).attr("id", `course-day-${i}`);
          input.prev("label").attr("for", `course-day-${i}`);
          input.attr("placeholder", "—");
        });
        form.append(scheduleSection.append(schedule));
      }
    });
    const panel = $(
      '<div class="admin-dialog-panel admin-editor-panel"><div class="admin-dialog-header"><div></div></div><div class="admin-dialog-scroll"></div><div class="admin-dialog-footer"></div></div>',
    );
    panel
      .find(".admin-dialog-header > div")
      .append(title, $("<p></p>").text(editor.description));
    panel.find(".admin-dialog-header").append(close);
    panel.find(".admin-dialog-scroll").append(form);
    for (const button of [cancel, save]) button.attr("form", editor.form);
    panel.find(".admin-dialog-footer").append(cancel, save);
    modal.empty().append(panel);
  }
  $('[id$="Modal"]').each((_, element) => {
    const modal = $(element);
    if (!modal.hasClass("fixed")) return;
    modal
      .attr({ role: "dialog", "aria-modal": "true", tabindex: "-1" })
      .addClass("admin-dialog");
    modal.children().first().addClass("admin-dialog-panel");
    const panel = modal.children().first();
    if (!panel.hasClass("admin-editor-panel")) {
      panel.children().first().addClass("admin-dialog-header");
      panel
        .children()
        .last()
        .filter(":has(button)")
        .addClass("admin-dialog-footer");
    }
    const title = modal.find("h2,h3").first();
    if (!title.attr("id")) title.attr("id", modal.attr("id") + "-title");
    modal.attr("aria-labelledby", title.attr("id") || "");
    modal
      .find("button:has(.ph-x)")
      .attr({ type: "button", "aria-label": "Închide" });
  });
}
