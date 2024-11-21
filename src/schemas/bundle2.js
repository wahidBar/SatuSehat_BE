const { z } = require("zod");
const uuidWithUrn = z
  .string()
  .refine(
    (val) =>
      /^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        val
      ),
    {
      message: "Invalid uuid",
    }
  );

const IdentifierSchema = z.object({
  system: z.string().url(),
  value: z.string(),
});

const CodingSchema = z.object({
  system: z.string().url(),
  code: z.string(),
  display: z.string(),
});

const CodeableConceptSchema = z.object({
  coding: z.array(CodingSchema),
  text: z.string().optional(),
});

const ReferenceSchema = z.object({
  reference: z.string(),
  display: z.string().optional(),
});

const PeriodSchema = z.object({
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
});

const ParticipantSchema = z.object({
  type: z.array(CodeableConceptSchema),
  individual: ReferenceSchema,
});

const DiagnosisSchema = z.object({
  condition: ReferenceSchema,
  use: CodeableConceptSchema,
  rank: z.number(),
});

const StatusHistorySchema = z.object({
  status: z.string(),
  period: PeriodSchema,
});

const EncounterSchema = z.object({
  resourceType: z.literal("Encounter"),
  identifier: z.array(IdentifierSchema),
  status: z.string(),
  class: z.object({
    coding: z.array(CodingSchema).optional(),
    system: z.string().url().optional(),
    code: z.string().optional(),
    display: z.string().optional(),
  }),
  subject: ReferenceSchema,
  participant: z.array(ParticipantSchema),
  period: PeriodSchema,
  location: z.array(
    z.object({
      location: ReferenceSchema,
    })
  ),
  diagnosis: z.array(DiagnosisSchema),
  statusHistory: z.array(StatusHistorySchema),
  serviceProvider: ReferenceSchema,
});

const ObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  status: z.string(),
  category: z.array(CodeableConceptSchema),
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  performer: z.array(ReferenceSchema),
  encounter: ReferenceSchema,
  effectiveDateTime: z.string().datetime({ offset: true }),
  issued: z.string().datetime({ offset: true }),
  valueQuantity: z.object({
    value: z.number(),
    unit: z.string(),
    system: z.string().url(),
    code: z.string(),
  }),
  bodySite: CodeableConceptSchema.optional(),
  interpretation: z.array(CodeableConceptSchema).optional(),
});

const ConditionSchema = z.object({
  resourceType: z.literal("Condition"),
  clinicalStatus: CodeableConceptSchema,
  category: z.array(CodeableConceptSchema),
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  encounter: ReferenceSchema,
  onsetDateTime: z.string().datetime({ offset: true }),
  recordedDate: z.string().datetime({ offset: true }),
});

const ProcedureSchema = z.object({
  resourceType: z.literal("Procedure"),
  status: z.string(),
  category: CodeableConceptSchema,
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  encounter: ReferenceSchema,
  performedPeriod: PeriodSchema,
  performer: z.array(
    z.object({
      actor: ReferenceSchema,
    })
  ),
  reasonCode: z.array(CodeableConceptSchema),
  bodySite: z.array(CodeableConceptSchema),
  note: z.array(
    z.object({
      text: z.string(),
    })
  ),
});

const SectionSchema = z.object({
  code: CodeableConceptSchema,
  text: z.object({
    status: z.string(),
    div: z.string(),
  }),
});

const CompositionSchema = z.object({
  resourceType: z.literal("Composition"),
  identifier: IdentifierSchema,
  status: z.string(),
  type: CodeableConceptSchema,
  category: z.array(CodeableConceptSchema),
  subject: ReferenceSchema,
  encounter: ReferenceSchema,
  date: z.string().datetime({ offset: true }),
  author: z.array(ReferenceSchema),
  title: z.string(),
  custodian: ReferenceSchema,
  section: z.array(SectionSchema),
});

const EntrySchema = z.object({
  fullUrl: uuidWithUrn,
  resource: z.union([
    EncounterSchema,
    ObservationSchema,
    ConditionSchema,
    ProcedureSchema,
    CompositionSchema,
  ]),
  request: z.object({
    method: z.enum(["POST"]),
    url: z.string(),
  }),
});

const BundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  type: z.literal("transaction"),
  entry: z.array(EntrySchema),
});

module.exports = { BundleSchema };
