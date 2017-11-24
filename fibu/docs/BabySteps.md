# Fibu baby steps: some hints to jump in


## Rest Services 

### Curl basic commands to call the rest service 


Basic usage: the command below will list known API end points

```
 curl -i http://localhost:7070
```


List accounts  

```
 curl -i http://localhost:7070/api/accounts
```

Create new obects

```
 # An account
 curl -i -X POST -H "Content-Type:application/json" \
   -d "{ \"code\" : \"520\", \"title\" : \"Bank\"}" \
   http://localhost:7070/accounts
 # A payment
 curl -i -X POST -H "Content-Type:application/json" \
 -d "{    \"date\" : \"2017-11-18T13:56:07.112+0000\", \
          \"amount\" : \"9\", \"currency\":\"EUR\", \
          \"title\":\"Un autre\"} \
          " http://localhost:7070/payments

 # Note the format of the date, less precise also works, like:
 # 2017-11-18    or    2017-11-18T13:56+00

```

Search and search by code 

```
 # will return info about the possible search request
 curl -i http://localhost:7070/api/accounts/search/
 # Warning, the code param name is ambiguous and must be explicitely declared in the corresponding repository method
 curl -i http://localhost:7070/api/accounts/search/findByCode?code=520
```