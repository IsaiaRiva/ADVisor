const SolutionManifest = {
  "S3": {
    "UseAccelerateEndpoint": true,
    "ExpectedBucketOwner": "775588314269"
  },
  "Shoppable": {
    "ApiKey": "fe664a83-6067-001e-b401-c7223db9c1cd-shoppable",
    "Endpoint": "https://zzp90lnev2.execute-api.eu-west-1.amazonaws.com/demo"
  },
  "IotHost": "ar3ajum0as5f8-ats.iot.eu-west-1.amazonaws.com",
  "StateMachines": {
    "Ingest": "so0050-02170cc81389-ingest-main",
    "AssetRemoval": "so0050-02170cc81389-asset-removal",
    "Analysis": "so0050-02170cc81389-analysis-main",
    "UpdateFaceIndexer": "so0050-02170cc81389-update-face-indexer",
    "Main": "so0050-02170cc81389-main"
  },
  "ApiEndpoint": "https://e3jwlrla94.execute-api.eu-west-1.amazonaws.com/demo",
  "IotTopic": "so0050-02170cc81389/status",
  "Proxy": {
    "Bucket": "so0050-02170cc81389-775588314269-eu-west-1-proxy"
  },
  "Ingest": {
    "Bucket": "so0050-02170cc81389-775588314269-eu-west-1-ingest"
  },
  "SolutionId": "SO0050",
  "Version": "v4.1214",
  "KnowledgeGraph": {
    "ApiKey": "",
    "Endpoint": ""
  },
  "Region": "eu-west-1",
  "Cognito": {
    "Group": {
      "Viewer": "viewer",
      "Creator": "creator",
      "Admin": "admin"
    },
    "UserPoolId": "eu-west-1_CrcG69RSF",
    "ClientId": "6vu27h52ad22qr2eibqofdcfdv",
    "IdentityPoolId": "eu-west-1:62ce4ae8-a6e4-4dbe-b7db-f585bc69e267",
    "RedirectUri": "https://d3o4ien48pgn70.cloudfront.net"
  },
  "LastUpdated": "2023-12-14T15:13:07.701Z",
  "CustomUserAgent": "AWSSOLUTION/SO0050/v4.1214",
  "StackName": "so0050-02170cc81389",
  "AIML": {
    "celeb": true,
    "face": true,
    "facematch": true,
    "label": true,
    "moderation": true,
    "person": true,
    "text": true,
    "segment": true,
    "customlabel": false,
    "imageprop": false,
    "minConfidence": 80,
    "customLabelModels": [],
    "frameCaptureMode": 0,
    "textROI": [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "framebased": false,
    "transcribe": true,
    "keyphrase": true,
    "entity": true,
    "sentiment": true,
    "customentity": false,
    "textract": true,
    "adbreak": false,
    "autofaceindexer": false,
    "zeroshotlabels": [],
    "scene": false,
    "shoppable": false,
    "toxicity": false
  },
  "ApiOps": {
    "Assets": "assets",
    "Analysis": "analysis",
    "Search": "search",
    "Execution": "execution",
    "AttachPolicy": "attach-policy",
    "FaceCollections": "rekognition/face-collections",
    "FaceCollection": "rekognition/face-collection",
    "Faces": "rekognition/faces",
    "Face": "rekognition/face",
    "CustomLabelModels": "rekognition/custom-label-models",
    "CustomVocabularies": "transcribe/custom-vocabularies",
    "CustomLanguageModels": "transcribe/custom-language-models",
    "CustomEntityRecognizers": "comprehend/custom-entity-recognizers",
    "Stats": "stats",
    "Users": "users",
    "AIOptionsSettings": "settings/aioptions",
    "Tokenize": "genai/tokenize",
    "Genre": "genai/genre",
    "Sentiment": "genai/sentiment",
    "Summarize": "genai/summarize",
    "Taxonomy": "genai/taxonomy",
    "Theme": "genai/theme",
    "TVRatings": "genai/tvratings",
    "Custom": "genai/custom",
    "FaceIndexer": "faceindexer"
  },
  "Statuses": {
    "Processing": "PROCESSING",
    "Completed": "COMPLETED",
    "Error": "ERROR",
    "None": "NONE",
    "NotStarted": "NOT_STARTED",
    "Started": "STARTED",
    "InProgress": "IN_PROGRESS",
    "NoData": "NO_DATA",
    "Removed": "REMOVED",
    "IngestStarted": "INGEST_STARTED",
    "IngestCompleted": "INGEST_COMPLETED",
    "IngestError": "INGEST_ERROR",
    "AnalysisStarted": "ANALYSIS_STARTED",
    "AnalysisCompleted": "ANALYSIS_COMPLETED",
    "AnalysisError": "ANALYSIS_ERROR"
  },
  "FrameCaptureMode": {
    "MODE_NONE": 0,
    "MODE_1FPS": 1,
    "MODE_2FPS": 2,
    "MODE_3FPS": 3,
    "MODE_4FPS": 4,
    "MODE_5FPS": 5,
    "MODE_10FPS": 10,
    "MODE_12FPS": 12,
    "MODE_15FPS": 15,
    "MODE_ALL": 1000,
    "MODE_HALF_FPS": 1001,
    "MODE_1F_EVERY_2S": 1002,
    "MODE_1F_EVERY_5S": 1003,
    "MODE_1F_EVERY_10S": 1004,
    "MODE_1F_EVERY_30S": 1005,
    "MODE_1F_EVERY_1MIN": 1011,
    "MODE_1F_EVERY_2MIN": 1012,
    "MODE_1F_EVERY_5MIN": 1013,
    "MODE_DYNAMIC_FPS": 9999
  },
  "AnalysisTypes": {
    "Rekognition": {
      "Celeb": "celeb",
      "Face": "face",
      "FaceMatch": "facematch",
      "Label": "label",
      "Moderation": "moderation",
      "Person": "person",
      "Text": "text",
      "Segment": "segment",
      "CustomLabel": "customlabel",
      "ImageProperty": "imageprop"
    },
    "Transcribe": "transcribe",
    "Comprehend": {
      "Keyphrase": "keyphrase",
      "Entity": "entity",
      "Sentiment": "sentiment",
      "CustomEntity": "customentity"
    },
    "Textract": "textract",
    "AdBreak": "adbreak",
    "AutoFaceIndexer": "autofaceindexer",
    "ZeroshotLabels": "zeroshotlabels",
    "Shoppable": "shoppable",
    "Scene": "scene",
    "Toxicity": "toxicity"
  },
  "GraphDefs": {
    "Vertices": {
      "Asset": "asset",
      "Group": "group",
      "Attribute": "attrib",
      "Checksum": "chksum",
      "Celeb": "celeb",
      "Label": "label",
      "Keyword": "keyword"
    },
    "Edges": {
      "BelongTo": "belong_to",
      "HasAttribute": "has_attrib",
      "HasChecksum": "has_chksum",
      "HasCeleb": "has_celeb",
      "HasLabel": "has_label",
      "HasModerationLabel": "has_moderationlabel",
      "HasKeyword": "has_keyword"
    }
  },
  "FaceIndexerDefs": {
    "Version": "v4",
    "Actions": {
      "Tagging": "tagging",
      "Deleting": "deleting"
    }
  },
  "FoundationModels": [
    {
      "name": "Anthropic Claude V2",
      "value": "anthropic.claude-v2:1"
    }
  ]
};

export default SolutionManifest;
