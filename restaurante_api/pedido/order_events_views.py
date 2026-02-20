from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from .mongo import db
from .mongo_serializers import OrderEventSerializer

col = db["order_events"]

def fix_id(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

def oid_or_none(id_str: str):
    try:
        return ObjectId(id_str)
    except InvalidId:
        return None

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def order_events_list_create(request):
    if request.method == "GET":
        q = dict(request.query_params)
        for k, v in list(q.items()):
            if k == "order_id" and v:
                q[k] = int(v[0])
        docs = list(col.find(q).sort("created_at", -1))
        for d in docs:
            if "created_at" in d and hasattr(d["created_at"], "isoformat"):
                d["created_at"] = d["created_at"].isoformat()
        return Response([fix_id(d) for d in docs])

    serializer = OrderEventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = dict(serializer.validated_data)
    from datetime import datetime
    data["created_at"] = datetime.utcnow()
    res = col.insert_one(data)
    doc = col.find_one({"_id": res.inserted_id})
    if doc and "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
        doc = dict(doc)
        doc["created_at"] = doc["created_at"].isoformat()
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)

@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def order_events_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc = dict(doc)
            doc["created_at"] = doc["created_at"].isoformat()
        return Response(fix_id(doc))

    if request.method in ["PUT", "PATCH"]:
        serializer = OrderEventSerializer(data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)
        col.update_one({"_id": _id}, {"$set": serializer.validated_data})
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc = dict(doc)
            doc["created_at"] = doc["created_at"].isoformat()
        return Response(fix_id(doc))

    res = col.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)
