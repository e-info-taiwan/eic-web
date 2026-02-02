import { CompositeDecorator } from 'draft-js'
import { entityDecorators } from './entity-decorators'

const { annotationDecorator, emailDecorator, footnoteDecorator, linkDecorator } =
  entityDecorators

const decorators = new CompositeDecorator([
  annotationDecorator,
  footnoteDecorator,
  linkDecorator,
  emailDecorator,
])

export default decorators
