ARG VERSION

# Stage: install
# -------------------------------------
FROM python:3.8-slim
ARG VERSION

WORKDIR /snappi
RUN python -m pip install --upgrade snappi==$VERSION

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#COPY main.py .
#COPY entrypoint.sh .

#RUN chmod +x *.py *.sh

#CMD ["python", "-u", "/app/main.py"]
#ENTRYPOINT ["/app/entrypoint.sh"]

