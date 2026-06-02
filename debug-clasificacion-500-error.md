# Debug Session: clasificacion-500-error
- **Status**: [OPEN]
- **Issue**: `POST /SIGCQAL_dev/api/clasificacion-juridica` fails with 500 due to DB NOT NULL violation (`detalle_asesoria.id_expediente` is null). Browser also shows CSP error from `contentScript.bundle.js`.

## Reproduction Steps
1. Start backend (SIGCQAL-API) on `http://localhost:8081`.
2. From frontend (SIGCQAL-WEB) trigger "Confirmar Calificación" which POSTs to `/SIGCQAL_dev/api/clasificacion-juridica`.
3. Observe backend logs: insert into `sustantiva.detalle_asesoria` violates NOT NULL on `id_expediente`.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | `ClasificacionJuridicaMapper` does not map `request.idExpediente` into the JPA entity field used for `detalle_asesoria.id_expediente`. | High | Low | Pending |
| B | `ClasificacionJuridicaEntity` is missing the `id_expediente` mapping, so Hibernate never includes it in the INSERT. | High | Med | Pending |
| C | The adapter/service persists a child entity (`detalle_asesoria`) without setting its expediente relationship/foreign key. | Med | Med | Pending |
| D | The CSP error referencing `contentScript.bundle.js` is injected by a Chrome extension (not the app CSP). | High | Low | Observed in browser console |

## Evidence (Current)
- Backend log shows: `ERROR: el valor nulo en la columna "id_expediente" ... viola ... not-null` during INSERT into `sustantiva.detalle_asesoria`.
- Browser CSP message contains a `chrome-extension://...` source, indicating extension scope.

## Findings (Static)
- `ClasificacionJuridicaEntity` had the `@ManyToOne` mapping for `id_expediente` commented out.
- `ClasificacionJuridicaMapper` had the mapping from `idExpediente` to `entity.expediente` commented out.
