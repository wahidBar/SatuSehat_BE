const { z } = require("zod");

const SchemaSatuSehat = z.object({
  resourceType: z.literal("Encounter"),
  identifier: z.array(
    z.object({
      system: z.string().url(),
      value: z.string(),
    })
  ),
  status: z.literal("arrived"),
  class: z.object({
    system: z.string().url(),
    code: z.literal("AMB"),
    display: z.literal("ambulatory"),
  }),
  subject: z.object({
    reference: z.string(),
    display: z.string(),
  }),
  participant: z.array(
    z.object({
      type: z.array(
        z.object({
          coding: z.array(
            z.object({
              system: z.string().url(),
              code: z.literal("ATND"),
              display: z.literal("attender"),
            })
          ),
        })
      ),
      individual: z.object({
        reference: z.string(),
        display: z.string(),
      }),
    })
  ),
  period: z.object({
    start: z.string().datetime(),
  }),
  location: z.array(
    z.object({
      location: z.object({
        reference: z.string(),
        display: z.string(),
      }),
      extension: z.array(
        z.object({
          url: z.string().url(),
          extension: z.array(
            z.object({
              url: z.string(),
              valueCodeableConcept: z.object({
                coding: z.array(
                  z.object({
                    system: z.string().url(),
                    code: z.literal("reguler"),
                    display: z.literal("Kelas Reguler"),
                  })
                ),
              }),
            })
          ),
        })
      ),
    })
  ),
  statusHistory: z.array(
    z.object({
      status: z.literal("arrived"),
      period: z.object({
        start: z.string().datetime(),
      }),
    })
  ),
  serviceProvider: z.object({
    reference: z.string(),
  }),
});

module.exports = { SchemaSatuSehat };
