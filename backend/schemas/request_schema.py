from pydantic import BaseModel

class PredictRequest(BaseModel):
    commodity: str
    district: str
    month: int
    year: int
