import { Assessment } from '../../../components/assessment.js'
import { Bead, FileBead, Thread } from '../../../components/thread.js'

class AssessmentBead extends Bead {
    constructor(assessment) {
        super('system', '')
        this.assessment = assessment
    }

    get content() {
        return this.assessment.toString()
    }

    set content(value) {
        this._content = 'dummy'
    }
}

export default {
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    data() {
        return {
            thread: new Thread(
                new FileBead('system', '../app/assess/assess-prompt.md', '../../prompts/glossary.md'),
                new AssessmentBead(this.assessment),
            ),
        }
    },
}
