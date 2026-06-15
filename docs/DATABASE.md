# Rancangan Database

Schema Prisma awal tersedia di `packages/database/prisma/schema.prisma`.

## Kelompok data

### Identitas dan akses

- `User`
- `Role`
- `Permission`
- `UserRole`
- `RolePermission`

### Authoring

- `Blueprint`
- `BlueprintVersion`
- `Stimulus`
- `StimulusVersion`
- `Question`
- `QuestionVersion`
- `QuestionOption`
- `Asset`

### Workflow

- `ReviewWorkflow`
- `ReviewStage`
- `ReviewAssignment`
- `ReviewDecision`
- `ChangeLog`

### Delivery

- `ExamPackage`
- `PublishedStimulus`
- `PublishedQuestion`
- `PublishedOption`
- `ExamPackageItem`

### Assessment

- `Participant`
- `ExamSession`
- `Attempt`
- `ParticipantAnswer`
- `Score`

### Operasional

- `ImportJob`
- `ImportRow`
- `AuditLog`

## Aturan penting

1. `QuestionVersion` dapat merujuk `StimulusVersion`.
2. `QuestionOption` dimiliki versi soal, bukan induk soal.
3. Soal terbit memakai tabel snapshot.
4. Jawaban peserta merujuk published question/option, bukan draft.
5. Kunci jawaban dipisahkan dari payload peserta.
6. Setiap perubahan versi bersifat append-only; versi lama tidak dihapus.
7. Audit log kritis dibuat append-only pada lapisan aplikasi/database.
