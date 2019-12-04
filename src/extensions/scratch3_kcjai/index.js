/* eslint-disable camelcase */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-warning-comments */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-template */
/* eslint-disable no-var */
/* eslint-disable no-unreachable */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const nets = require('nets');
const formatMessage = require('format-message');
const Video = require('../../io/video');

const VideoMotion = require('../scratch3_video_sensing/library');

// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnODE1IiBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIiBzb2RpcG9kaTpkb2NuYW1lPSJEYXRhVmlld2VySWNvbi5wbmciIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgoJIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjEuNCAxNS40IgoJIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDIxLjQgMTUuNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMC4zLDYuN2MtMC4xLTAuMS0wLjItMC4xLTAuNC0wLjFjLTAuMSwwLTAuMywwLjEtMC40LDAuMmwtNS4xLDYuNGMtMC4xLDAuMS0wLjEsMC4yLTAuMSwwLjQKCQljMCwwLjEsMC4xLDAuMywwLjIsMC4zYzAuMSwwLjEsMC4yLDAuMSwwLjMsMC4xYzAuMiwwLDAuMy0wLjEsMC40LTAuMmw1LjEtNi40QzIwLjYsNy4yLDIwLjUsNi45LDIwLjMsNi43eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEzLjUsMS40Yy0xLjEsMC0yLjIsMC42LTIuOCwxLjVjLTAuNi0xLTEuNi0xLjUtMi44LTEuNWMtMS44LDAtMy4zLDEuNS0zLjMsMy4zYzAsMC4zLDAuMiwwLjUsMC41LDAuNQoJCWMwLjMsMCwwLjUtMC4yLDAuNS0wLjVjMC0xLjMsMS0yLjMsMi4zLTIuM3MyLjMsMSwyLjMsMi4zYzAsMC4zLDAuMiwwLjUsMC41LDAuNWMwLjMsMCwwLjUtMC4yLDAuNS0wLjVjMC0xLjMsMS0yLjMsMi4zLTIuMwoJCXMyLjMsMSwyLjMsMi4zYzAsMC4zLDAuMiwwLjUsMC41LDAuNXMwLjUtMC4yLDAuNS0wLjVDMTYuOCwyLjgsMTUuMywxLjQsMTMuNSwxLjR6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNCw2LjljMC0wLjEtMC4xLTAuMy0wLjItMC4zbDAsMGMtMC4yLTAuMi0wLjYtMC4xLTAuNywwLjFsLTQuOCw2bC00LjgtNkM1LjksNi41LDUuNyw2LjUsNS42LDYuNAoJCXMtMC4zLDAtMC40LDAuMUM1LjEsNi42LDUsNi44LDUsNi45QzUsNyw1LDcuMiw1LjEsNy4zbDUuMiw2LjZjMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjJjMC4yLDAsMC4zLTAuMSwwLjQtMC4ybDUuMi02LjYKCQlDMTYuNCw3LjIsMTYuNCw3LDE2LjQsNi45eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuOSwxMy4yTDEuOCw2LjhDMS43LDYuNSwxLjMsNi41LDEuMSw2LjdDMC45LDYuOCwwLjgsNy4yLDEsNy40bDUuMSw2LjRDNi4yLDE0LDYuNCwxNCw2LjUsMTQKCQljMC4xLDAsMC4yLDAsMC4zLTAuMUM3LDEzLjgsNywxMy43LDcuMSwxMy42QzcuMSwxMy40LDcsMTMuMyw2LjksMTMuMnoiLz4KPC9nPgo8c29kaXBvZGk6bmFtZWR2aWV3ICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgYm9yZGVyb3BhY2l0eT0iMSIgZ3JpZHRvbGVyYW5jZT0iMTAiIGd1aWRldG9sZXJhbmNlPSIxMCIgaWQ9Im5hbWVkdmlldzgxNyIgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnODE1IiBpbmtzY2FwZTpjeD0iMTAuNjkwNDIzIiBpbmtzY2FwZTpjeT0iNy42OTcxMDQ1IiBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAyNyIgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIiBpbmtzY2FwZTp3aW5kb3cteD0iLTgiIGlua3NjYXBlOndpbmRvdy15PSIyMiIgaW5rc2NhcGU6em9vbT0iNTUuNzM1MjQ1IiBvYmplY3R0b2xlcmFuY2U9IjEwIiBwYWdlY29sb3I9IiNmZmZmZmYiIHNob3dncmlkPSJmYWxzZSI+Cgk8L3NvZGlwb2RpOm5hbWVkdmlldz4KPC9zdmc+Cg==';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnODE1IiBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIiBzb2RpcG9kaTpkb2NuYW1lPSJEYXRhVmlld2VySWNvbi5wbmciIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgoJIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTguNSAxOC41IgoJIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE4LjUgMTguNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM4M0JGRDI7fQoJLnN0MXtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cmVjdCB5PSIwIiBjbGFzcz0ic3QwIiB3aWR0aD0iMTguNSIgaGVpZ2h0PSIxOC41Ii8+CjxnPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2LjksOC40Yy0wLjEtMC4xLTAuMi0wLjEtMC4zLTAuMXMtMC4yLDAuMS0wLjMsMC4ybC00LDUuMWMtMC4xLDAuMS0wLjEsMC4yLTAuMSwwLjNjMCwwLjEsMC4xLDAuMiwwLjIsMC4zCgkJYzAuMSwwLjEsMC4yLDAuMSwwLjMsMC4xYzAuMSwwLDAuMi0wLjEsMC4zLTAuMmw0LTUuMUMxNy4xLDguOCwxNyw4LjYsMTYuOSw4LjR6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTEuNSw0LjJjLTAuOSwwLTEuNywwLjUtMi4yLDEuMkM4LjgsNC43LDcuOSw0LjIsNyw0LjJjLTEuNSwwLTIuNiwxLjItMi42LDIuNmMwLDAuMiwwLjIsMC40LDAuNCwwLjQKCQljMC4yLDAsMC40LTAuMiwwLjQtMC40QzUuMiw1LjgsNiw1LDcsNXMxLjgsMC44LDEuOCwxLjhjMCwwLjIsMC4yLDAuNCwwLjQsMC40YzAuMiwwLDAuNC0wLjIsMC40LTAuNGMwLTEsMC44LTEuOCwxLjgtMS44CgkJczEuOCwwLjgsMS44LDEuOGMwLDAuMiwwLjIsMC40LDAuNCwwLjRzMC40LTAuMiwwLjQtMC40QzE0LjEsNS40LDEyLjksNC4yLDExLjUsNC4yeiIvPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzLjgsOC42YzAtMC4xLTAuMS0wLjItMC4yLTAuM2wwLDBjLTAuMi0wLjEtMC40LTAuMS0wLjYsMC4xbC0zLjgsNC44TDUuNSw4LjRDNS40LDguMyw1LjMsOC4zLDUuMiw4LjMKCQljLTAuMSwwLTAuMiwwLTAuMywwLjFDNC44LDguNCw0LjgsOC41LDQuNyw4LjZjMCwwLjEsMCwwLjIsMC4xLDAuM2w0LjEsNS4yYzAuMSwwLjEsMC4yLDAuMiwwLjMsMC4yYzAuMSwwLDAuMi0wLjEsMC4zLTAuMgoJCWw0LjEtNS4yQzEzLjcsOC44LDEzLjgsOC43LDEzLjgsOC42eiIvPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuMywxMy42TDIuMiw4LjVDMi4xLDguMywxLjgsOC4zLDEuNiw4LjRDMS41LDguNiwxLjQsOC44LDEuNiw5bDQsNS4xYzAuMSwwLjEsMC4yLDAuMiwwLjMsMC4yCgkJYzAuMSwwLDAuMiwwLDAuMy0wLjFjMC4xLTAuMSwwLjEtMC4yLDAuMi0wLjNDNi40LDEzLjgsNi4zLDEzLjcsNi4zLDEzLjZ6Ii8+CjwvZz4KPHNvZGlwb2RpOm5hbWVkdmlldyAgYm9yZGVyY29sb3I9IiM2NjY2NjYiIGJvcmRlcm9wYWNpdHk9IjEiIGdyaWR0b2xlcmFuY2U9IjEwIiBndWlkZXRvbGVyYW5jZT0iMTAiIGlkPSJuYW1lZHZpZXc4MTciIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzgxNSIgaW5rc2NhcGU6Y3g9IjEwLjY5MDQyMyIgaW5rc2NhcGU6Y3k9IjcuNjk3MTA0NSIgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMjciIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIgaW5rc2NhcGU6d2luZG93LXg9Ii04IiBpbmtzY2FwZTp3aW5kb3cteT0iMjIiIGlua3NjYXBlOnpvb209IjU1LjczNTI0NSIgb2JqZWN0dG9sZXJhbmNlPSIxMCIgcGFnZWNvbG9yPSIjZmZmZmZmIiBzaG93Z3JpZD0iZmFsc2UiPgoJPC9zb2RpcG9kaTpuYW1lZHZpZXc+Cjwvc3ZnPgo=';

const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

/**
 * Subject video sensor block should report for.
 * @readonly
 * @enum {string}
 */
const SensingSubject = {
    /** The sensor traits of the whole stage. */
    STAGE: 'Stage',

    /** The senosr traits of the area overlapped by this sprite. */
    SPRITE: 'this sprite'
};

/**
 * Sensor attribute video sensor block should report.
 * @readonly
 * @enum {string}
 */
const SensingAttribute = {
    /** The amount of motion. */
    MOTION: 'motion',

    /** The direction of the motion. */
    DIRECTION: 'direction'
};

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
const VideoState = {
    /** Video turned off. */
    OFF: 'off',

    /** Video turned on with default y axis mirroring. */
    ON: 'on',

    /** Video turned on without default y axis mirroring. */
    ON_FLIPPED: 'on-flipped'
};

class Scratch3KCJAIBlocks {

    constructor (runtime) {
        this._runtime = runtime;

        /**
         * A flag to determine if this extension has been installed in a project.
         * It is set to false the first time getInfo is run.
         * @type {boolean}
         */
        this.firstInstall = true;
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    /**
     * An array of choices of whether a reporter should return the frame's
     * motion amount or direction.
     * @type {object[]}
     * @param {string} name - the translatable name to display in sensor
     *   attribute menu
     * @param {string} value - the serializable value of the attribute
     */
    get ATTRIBUTE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.motion',
                    default: 'motion',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.MOTION
            },
            {
                name: formatMessage({
                    id: 'videoSensing.direction',
                    default: 'direction',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.DIRECTION
            }
        ];
    }

    /**
     * An array of info about the subject choices.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the subject menu
     * @param {string} value - the serializable value of the subject
     */
    get SUBJECT_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.sprite',
                    default: 'sprite',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.SPRITE
            },
            {
                name: formatMessage({
                    id: 'videoSensing.stage',
                    default: 'stage',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.STAGE
            }
        ];
    }

    /**
     * An array of info on video state options for the "turn video [STATE]" block.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the video state menu
     * @param {string} value - the serializable value stored in the block
     */
    get VIDEO_STATE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.off',
                    default: 'off',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.OFF
            },
            {
                name: formatMessage({
                    id: 'videoSensing.on',
                    default: 'on',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.ON
            },
            {
                name: formatMessage({
                    id: 'videoSensing.onFlipped',
                    default: 'on flipped',
                    description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
                        ' horizontally (reversed as in a mirror)'
                }),
                value: VideoState.ON_FLIPPED
            }
        ];
    }

    /**
     * Get the latest values for video transparency and state,
     * and set the video device to use them.
     */
    updateVideoDisplay () {
        this.setVideoTransparency({
            TRANSPARENCY: this.globalVideoTransparency
        });
        this.videoToggle({
            VIDEO_STATE: this.globalVideoState
        });
    }

    /**
     * The video state of the video preview stored in a value accessible by any
     * object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoState () {
        const stage = this._runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        // Though the default value for the stage is normally 'on', we need to default
        // to 'off' here to prevent the video device from briefly activating
        // while waiting for stage targets to be installed that say it should be off
        return VideoState.OFF;
    }

    set globalVideoState (state) {
        const stage = this._runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    /**
     * The transparency setting of the video preview stored in a value
     * accessible by any object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoTransparency () {
        const stage = this._runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 50;
    }

    set globalVideoTransparency (transparency) {
        const stage = this._runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    static get SensingAttribute () {
        return SensingAttribute;
    }

    getInfo () {
        // Set the video display properties to defaults the first time
        // getInfo is run. This turns on the video device when it is
        // first added to a project, and is overwritten by a PROJECT_LOADED
        // event listener that later calls updateVideoDisplay
        if (this.firstInstall) {
            this.globalVideoState = VideoState.ON;
            this.globalVideoTransparency = 50;
            this.updateVideoDisplay();
            this.firstInstall = false;
        }
        return {
            id: 'dataviewer',
            name: formatMessage({
                id: 'dataviewer.categoryName',
                default: 'KCJ AI',
                description: 'Label for the KCJ AI extension category'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'videoSnapshot',
                    text: formatMessage({
                        id: 'videoSensing.videoSnapshot',
                        default: 'take video snapshot',
                        description: 'Controls display of the video preview layer'
                    })
                },
                {
                    opcode: 'setVideoTransparency',
                    text: formatMessage({
                        id: 'videoSensing.setVideoTransparency',
                        default: 'set video transparency to [TRANSPARENCY]',
                        description: 'Controls transparency of the video preview layer'
                    }),
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'videoToggle',
                    text: formatMessage({
                        id: 'videoSensing.videoToggle',
                        default: 'turn video [VIDEO_STATE]',
                        description: 'Controls display of the video preview layer'
                    }),
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.NUMBER,
                            menu: 'VIDEO_STATE',
                            defaultValue: VideoState.ON
                        }
                    }
                }
            ],
            menus: {
                ATTRIBUTE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.ATTRIBUTE_INFO)
                },
                SUBJECT: {
                    acceptReporters: true,
                    items: this._buildMenu(this.SUBJECT_INFO)
                },
                VIDEO_STATE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VIDEO_STATE_INFO)
                }
            }
        };
    }
    // Video Stuff Starts Here

    /**
     * A scratch command block handle that captures an image
     * from the webcam feed.
     */
    videoSnapshot () {
        // debugger;
        if (this.globalVideoState === VideoState.OFF) {
            this._runtime.ioDevices.video.enableVideo();
        }
        this._runtime.ioDevices.video.getSnapshot();
    }
    
    /**
     * A scratch command block handle that configures the video state from
     * passed arguments.
     * @param {object} args - the block arguments
     * @param {VideoState} args.VIDEO_STATE - the video state to set the device to
     */
    videoToggle (args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this._runtime.ioDevices.video.disableVideo();
        } else {
            this._runtime.ioDevices.video.enableVideo();
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this._runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency (args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this._runtime.ioDevices.video.setPreviewGhost(transparency);
    }
    // Video Stuff Ends Here

}

module.exports = Scratch3KCJAIBlocks;
